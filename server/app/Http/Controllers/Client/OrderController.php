<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderShipped;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderCancellation;
use App\Models\OrderCoupon;
use App\Models\OrderItem;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;


class OrderController extends Controller
{

    private function generateOrderCode()
    {
        $date = date('Ymd'); // Lấy ngày hiện tại theo định dạng Ymd
        $lastOrder = Order::whereDate('created_at', today())->orderBy('id', 'desc')->first();
        
        $increment = $lastOrder ? intval(substr($lastOrder->order_code, -3)) + 1 : 1; // Tăng mã đơn hàng
        return 'ORD-' . $date . '-' . str_pad($increment, 3, '0', STR_PAD_LEFT); // Định dạng mã đơn hàng
    }

    public function getOrder()
    {
        try {
            
            $data = Order::query()
            ->where('user_id', Auth::id())
            ->get();

        return response()->json([
            'data' => $data,
            'status' => 'success'
        ]);
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

    public function getOrderDetail($id)
    {
        try {
            
            $data = Order::query()
            ->with(['items.variant.attributeValues.attribute', 'items.variant.product'])
            ->where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

            return response()->json([
                'data' => $data,
                'status' => 'success'
            ],Response::HTTP_OK);
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

    public function store(Request $request)
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
                }

                
                if($order){
                    
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

    public function canceledOrder(Request $request ,$id)
    {
        try {
            $order = Order::query()->findOrFail($id);

            $request->validate([
                'reason' => 'required|max:225'
            ], [
                'reason.required' => 'Vui lòng nhập lý do',
                'reason.max' => 'Tiêu đề không được vượt quá 225 ký tự.',
            ]);

            $reason = $request->reason;

            $order->update(['status_order' => Order::STATUS_ORDER_CANCELED]);

            OrderCancellation::create([
                'reason' => $reason,
                'order_id' => $id,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Đơn hàng đã hủy thành công',
                'status' => 'success',
                'data' => $order
            ], Response::HTTP_OK);
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
}