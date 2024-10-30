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
use Str;

class PaymentController extends Controller
{

    private $tmnCode = "KFDM60UR";
    private $secretKey = "TSM1WWZ64ZAR2KYEEHAE99OWBYBCW9VQ";
    private $vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private $returnUrl = "http://localhost:5173";
    public function processPayment(Request $request)
    {
        $paymentMethod = $request->payment_method; // Nhận phương thức thanh toán từ form

        switch ($paymentMethod) {
            case 'COD':
                return $this->handleCOD($request);
            case 'VNPAY':
                return $this->handleVNPay($request);
            default:
                return response()->json(['error' => 'Phương thức thanh toán không hợp lệ'], 400);
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

    // private function handleVNPay(Request $request)
    // {
        // $vnp_Url = env('VNPAY_URL');
        // $vnp_TxnRef = '123456789'; 
        // $vnp_OrderInfo = "Thanh toan don hang";
        // $vnp_Amount = 10000*100; 
        // $vnp_Locale = 'vn';
        // $vnp_CurrCode = 'VND'; 
        // $vnp_ReturnUrl = 'http://localhost:5173';
        // $inputData = [
        //     "vnp_Version" => "2.1.0",
        //     "vnp_Command" => "billpayment",
        //     "vnp_TmnCode" => env('VNPAY_MERCHANT_ID'),
        //     "vnp_TxnRef" => $vnp_TxnRef,
        //     "vnp_OrderInfo" => $vnp_OrderInfo,
        //     "vnp_Amount" => $vnp_Amount,
        //     "vnp_Locale" => $vnp_Locale,
        //     "vnp_CurrCode" => $vnp_CurrCode,
        //     "vnp_ReturnUrl" => $vnp_ReturnUrl,
        //     "vnp_CreateDate" => date('YmdHis'),
        //     "vnp_IpAddr" => request()->ip(),    
        // ];

        // ksort($inputData);
        // $query = http_build_query($inputData);
        // $hashdata = urldecode($query);
        // $vnp_SecureHash = hash_hmac('SHA256', $hashdata, env('VNPAY_HASH_SECRET'));

        // $inputData['vnp_SecureHash'] = $vnp_SecureHash;

        // $vnp_Url .= "?" . http_build_query($inputData);
        // return response()->json([
        //     'url' => $vnp_Url
        // ]);
        
        // return redirect($vnp_Url);
    // }

    public function handleVNPay(Request $request)
    {
        $language = $request->input('language', 'vn');
        $bankCode = $request->input('bankCode');

        $vnp_Url = env('VNPAY_URL');
        $ipAddr = request()->ip();
        $createDate = time();
        $currCode = "VND";

        $inputData = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->tmnCode,
            'vnp_Locale' => 'language || "vn"',
            'vnp_CurrCode' => $currCode,
            'vnp_TxnRef' => Str::random(10),
            'vnp_OrderInfo' => 'orderDescription 12345646',
            'vnp_OrderType' => 'billpayment',
            'vnp_Amount' => 10000 * 100,
            'vnp_ReturnUrl' => $this->returnUrl,
            'vnp_IpAddr' => $ipAddr,
            'vnp_CreateDate' => $createDate,
        ];

        if ($bankCode) {
            $inputData['vnp_BankCode'] = $bankCode;
        }

        ksort($inputData);
        $query = http_build_query($inputData);
        $hashdata = urldecode($query);
        $vnp_SecureHash = hash_hmac('SHA256', $hashdata, env('VNPAY_HASH_SECRET'));

        $inputData['vnp_SecureHash'] = $vnp_SecureHash;

        $vnp_Url .= "?" . http_build_query($inputData);        Log:info('abc', (array)$vnpParams);
        return response()->json(['paymentUrl' => $vnp_Url]);
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

    // public function callback(Request $request)
    // {
    // Log::info(2);

    // // Lấy các thông tin từ callback
    // $data = $request->all();

    // // Lấy mã bảo mật từ file .env
    // $secureCode = env('VCPAY_SECURE_CODE');

    // // Tạo chữ ký để xác thực
    // $signatureData = implode('|', array_merge($data, [$secureCode]));
    // $signature = hash('sha256', $signatureData);

    // // Kiểm tra chữ ký
    // if ($signature !== $data['signature']) {
    //     return response()->json(['error' => 'Invalid signature'], 400);
    // }

    // // Xử lý kết quả giao dịch
    // $orderId = $data['order_id'];
    // $paymentStatus = $data['payment_status']; // Trạng thái thanh toán

    // // Cập nhật đơn hàng 
    // if ($paymentStatus == 'successful') {
    //     try {

    //         return DB::transaction(function() use ($request) {

    //             $selectedItems = $request->selected_items;
    //             // Nếu không có sản phẩm nào được chọn
    //             if (empty($selectedItems)) {
    //                 return response()->json([
    //                     'error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'
    //                 ]);
    //             }
    //             $cartItems = [];
    //             // Lấy thông tin các sản phẩm đã chọn
    //             $cartItems = Cart::query()
    //             ->with(['variant.attributeValues.attribute', 'variant.product', 'user', 'variant.inventoryStock'])
    //             ->where('user_id', Auth::id()) 
    //             ->whereIn('id', $selectedItems)
    //             ->get();

    //             if ($cartItems->isEmpty()) {
    //                 return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.']);
    //             }

    //             $data =  $request->all();
    //             $data['user_id'] = Auth::id();
    //             $data['code'] = $this->generateOrderCode();
    //             $data['grand_total'] = 0;

    //             foreach ($cartItems as $value) {
    //                 $data['grand_total'] += $value->quantity * ($value->variant->sale_price ?: $value->variant->price);
    //             }

    //             $order = Order::query()->create($data);

    //             if($request->coupon_id && $request->discount_amount){
                    
    //                 $coupon = Coupon::query()->where('id',  $request->coupon_id)->first();
    //                 $coupon->usage_limit -= 1;
    //                 $coupon->save();

    //                 OrderCoupon::query()->create([
    //                     'order_id' =>  $order->id,
    //                     'discount_amount' => $request->discount_amount,
    //                     'coupon_id' => $request->coupon_id
    //                 ]);

    //                 CouponUser::create([
    //                     'user_id' => Auth::id(),
    //                     'coupon_id' => $request->coupon_id,
    //                     'used_at' => now(),
    //                 ]);
    //             }
                
                

    //             if (!$order) {
    //                 return response()->json(['error' => 'Đặt hàng không thành công.']);
    //             }
                

    //             //Gửi mail && Xóa cart
    //             $order['idCart'] = $selectedItems;
    //             $order['discount_amount'] = $request->discount_amount;
    //             $order['items']=$cartItems;
    //             $order['user']=Auth::user();
    //             $orderData = json_decode($order);
    //             OrderShipped::dispatch($orderData);
                
    //             return response()->json([
    //                 'message' =>  'ĐẶT HÀNG THÀNH CÔNG',
    //                 'description'=>'Xin cảm ơn Quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.'
    //             ]);
    //         });


    //     } catch (\Throwable $th) {
    //         Log::error(__CLASS__ . '@' . __FUNCTION__, [
    //             'line' => $th->getLine(),
    //             'message' => $th->getMessage()
    //         ]);

    //         return response()->json([
    //             'message' => 'Lỗi tải trang',
    //             'status' => 'error',

    //         ], Response::HTTP_INTERNAL_SERVER_ERROR);
    //     }
    // } else {
    // }

    // return response()->json(['message' => 'Payment processed successfully']);
    // }

}