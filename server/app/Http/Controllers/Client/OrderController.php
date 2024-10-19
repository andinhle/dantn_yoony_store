<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderShipped;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderCoupon;
use App\Models\OrderItem;
use App\Models\Variant;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function applyDiscount(Request $request)
    {
        $request->validate([
            'discount_code' => 'required|string|max:255',
        ]);

        $discountCode = $request->input('discount_code');

        // Kiểm tra mã giảm giá (ví dụ: so với bảng discount_codes trong CSDL)
        $discount = Coupon::where('code', $discountCode)->first();

        if ($discount) {

            return response()->json([
                'message' => 'Mã giảm giá đã được áp dụng.',
                'discount' => $discount->value,
            ]);
        } else {
            // Mã giảm giá không hợp lệ
            return response()->json(['message' => 'Mã giảm giá không hợp lệ.'], 400);
        }
    }

    public function store(Request $request)
    {
        try {

            DB::transaction(function() use ($request) {



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
                ->with(['variant.attributeValues.attribute'])
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

                
                if($order){
                    $orderItems = [];

                    foreach ($cartItems as $value) {
                        $orderItem['order_id'] =   $order->id;
                        $orderItem['variant_id'] =   $value->variant_id;
                        $orderItem['quantity'] =   $value->quantity;
                        $orderItem['unit_price'] =   $value->variant->sale_price ?: $value->variant->price;
                        $orderItem['total_price'] =   $value->quantity * ($value->variant->sale_price ?: $value->variant->price);
 
                        $orderItems[] = $orderItem;

               
                        $variant = Variant::query()->where('id', $value->variant_id)->first();
                        $variant->quantity -= $value->quantity; 
                        $variant->save();
                    }
                    OrderItem::insert($orderItems);
                    
                    
                }
                

                if($request->coupon_id){
                    $coupon = Coupon::query()->where('id',  $request->coupon_id)->first();
                    $coupon->usage_limit -= 1;
                    $coupon->save();

                    OrderCoupon::query()->create([
                        'order_id' =>  $order->id,
                        'discount_amount' => $request->discount_amount,
                        'coupon_id' => $request->coupon_id
                    ]);
                }
                
                
                Cart::query()->where('user_id', Auth::id())
                ->whereIn('id',  $selectedItems )
                ->delete();
                // OrderShipped::dispatch($order);
                
                
                
                return response()->json([
                    'dataOrder' => $cartItems, 
                    // 'dataOrderItem' =>  $itemOrder , 
                    'message' =>  'success'
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

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}