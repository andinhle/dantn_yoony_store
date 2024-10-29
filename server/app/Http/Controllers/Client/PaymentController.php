<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderShipped;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Order;
use App\Models\OrderCoupon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function processPayment(Request $request)
    {
        $paymentMethod = $request->payment_method; // Nhận phương thức thanh toán từ form

        switch ($paymentMethod) {
            case 'COD':
                return $this->handleCOD($request);
            case 'VNPAY':
                return $this->handleVNPay($request);
            default:
                return response()->json(['error' => 'Invalid payment method'], 400);
        }
    }

    private function handleCOD(Request $request)
    {
        try {

            return DB::transaction(function() use ($request) {

                $selectedItems = $request->selected_items;
                // Nếu không có sản phẩm nào được chọn
                if (empty($selectedItems)) {
                    return response()->json([
                        'error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'
                    ]);
                }
                $cartItems = [];
                // Lấy thông tin các sản phẩm đã chọn
                $cartItems = Cart::query()
                ->with(['variant.attributeValues.attribute', 'variant.product', 'user', 'variant.inventoryStock'])
                ->where('user_id', Auth::id()) 
                ->whereIn('id', $selectedItems)
                ->get();

                if ($cartItems->isEmpty()) {
                    return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.']);
                }

                $data =  $request->all();
                $data['user_id'] = Auth::id();
                $data['code'] = $this->generateOrderCode();
                $data['grand_total'] = 0;

                foreach ($cartItems as $value) {
                    $data['grand_total'] += $value->quantity * ($value->variant->sale_price ?: $value->variant->price);
                }

                $order = Order::query()->create($data);

                if($request->coupon_id && $request->discount_amount){
                    
                    $coupon = Coupon::query()->where('id',  $request->coupon_id)->first();
                    $coupon->usage_limit -= 1;
                    $coupon->save();

                    OrderCoupon::query()->create([
                        'order_id' =>  $order->id,
                        'discount_amount' => $request->discount_amount,
                        'coupon_id' => $request->coupon_id
                    ]);

                    CouponUser::create([
                        'user_id' => Auth::id(),
                        'coupon_id' => $request->coupon_id,
                        'used_at' => now(),
                    ]);
                }
                
                

                if (!$order) {
                    return response()->json(['error' => 'Đặt hàng không thành công.']);
                }
                

                //Gửi mail && Xóa cart
                $order['idCart'] = $selectedItems;
                $order['discount_amount'] = $request->discount_amount;
                $order['items']=$cartItems;
                $order['user']=Auth::user();
                $orderData = json_decode($order);
                OrderShipped::dispatch($orderData);
                
                return response()->json([
                    'message' =>  'ĐẶT HÀNG THÀNH CÔNG',
                    'description'=>'Xin cảm ơn Quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.'
                ]);
            });


        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Lỗi tải trang',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function handleVNPay(Request $request)
    {
        $merchantCode = config('vnpay.merchant_id'); 
        $secureCode = config('vnpay.hash_secret'); 
        $orderId = uniqid();
        $amount = $request->input('final_total'); 

         // Thông tin giao dịch
        $data = [
            'merchant_code' => $merchantCode,
            'order_id' => $orderId,
            'amount' => $amount,
            'currency' => 'VND',
            'return_url' => url('/vcpay/callback'), // URL quay lại sau khi thanh toán
            'order_info' => 'Thanh toán đơn hàng', // Thông tin đơn hàng
            'transaction_id' => uniqid(), // ID giao dịch
            'locale' => 'vn', // Ngôn ngữ
            'signature' => '' // Chữ ký sẽ được tạo sau
        ];

        // Tạo chữ ký
        $signatureData = implode('|', array_merge($data, [$secureCode]));
        $data['signature'] = hash('sha256', $signatureData);

        // Chuyển hướng đến VNPay
        $paymentUrl = env('VCPAY_URL');
        return redirect()->away($paymentUrl . '?' . http_build_query($data));
    }

    private function generateOrderCode()
    {
    $date = date('Ymd');
    $lastOrder = Order::whereDate('created_at', today())->orderBy('code', 'desc')->first();
    
    if ($lastOrder && preg_match('/ORD-' . $date . '-(\d{3})$/', $lastOrder->code, $matches)) {
        $increment = intval($matches[1]) + 1; 
    } else {
        $increment = 1; 
    }
    
    return 'ORD-' . $date . '-' . str_pad($increment, 3, '0', STR_PAD_LEFT);
    }

    public function callback(Request $request)
{
    // Lấy các thông tin từ callback
    $data = $request->all();

    // Lấy mã bảo mật từ file .env
    $secureCode = env('VCPAY_SECURE_CODE');

    // Tạo chữ ký để xác thực
    $signatureData = implode('|', array_merge($data, [$secureCode]));
    $signature = hash('sha256', $signatureData);

    // Kiểm tra chữ ký
    if ($signature !== $data['signature']) {
        return response()->json(['error' => 'Invalid signature'], 400);
    }

    // Xử lý kết quả giao dịch
    $orderId = $data['order_id'];
    $paymentStatus = $data['payment_status']; // Trạng thái thanh toán

    // Cập nhật đơn hàng 
    if ($paymentStatus == 'successful') {
        try {

            return DB::transaction(function() use ($request) {

                $selectedItems = $request->selected_items;
                // Nếu không có sản phẩm nào được chọn
                if (empty($selectedItems)) {
                    return response()->json([
                        'error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'
                    ]);
                }
                $cartItems = [];
                // Lấy thông tin các sản phẩm đã chọn
                $cartItems = Cart::query()
                ->with(['variant.attributeValues.attribute', 'variant.product', 'user', 'variant.inventoryStock'])
                ->where('user_id', Auth::id()) 
                ->whereIn('id', $selectedItems)
                ->get();

                if ($cartItems->isEmpty()) {
                    return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.']);
                }

                $data =  $request->all();
                $data['user_id'] = Auth::id();
                $data['code'] = $this->generateOrderCode();
                $data['grand_total'] = 0;

                foreach ($cartItems as $value) {
                    $data['grand_total'] += $value->quantity * ($value->variant->sale_price ?: $value->variant->price);
                }

                $order = Order::query()->create($data);

                if($request->coupon_id && $request->discount_amount){
                    
                    $coupon = Coupon::query()->where('id',  $request->coupon_id)->first();
                    $coupon->usage_limit -= 1;
                    $coupon->save();

                    OrderCoupon::query()->create([
                        'order_id' =>  $order->id,
                        'discount_amount' => $request->discount_amount,
                        'coupon_id' => $request->coupon_id
                    ]);

                    CouponUser::create([
                        'user_id' => Auth::id(),
                        'coupon_id' => $request->coupon_id,
                        'used_at' => now(),
                    ]);
                }
                
                

                if (!$order) {
                    return response()->json(['error' => 'Đặt hàng không thành công.']);
                }
                

                //Gửi mail && Xóa cart
                $order['idCart'] = $selectedItems;
                $order['discount_amount'] = $request->discount_amount;
                $order['items']=$cartItems;
                $order['user']=Auth::user();
                $orderData = json_decode($order);
                OrderShipped::dispatch($orderData);
                
                return response()->json([
                    'message' =>  'ĐẶT HÀNG THÀNH CÔNG',
                    'description'=>'Xin cảm ơn Quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.'
                ]);
            });


        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Lỗi tải trang',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    } else {
    }

    return response()->json(['message' => 'Payment processed successfully']);
}

}