<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\CouponUser;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OderCheckController extends Controller
{
    public function checkOrder(Request $request)
    {
        $request->validate([
            'search' => 'required|string',
        ]);

        $search = $request->input('search');

        try {
            // Check if 'search' is an order code
            if (preg_match('/[A-Za-z]/', $search)) {
                $order = Order::where('code', $search)->first();

                // If order found, mask data and return order info
                if ($order) {
                    $order->name = $this->maskName($order->name);
                    $order->tel = $this->maskTel($order->tel);
                    $order->address = $this->maskAddress($order->address);

                    return response()->json([
                        'status' => 'success',
                        'order' => $order,
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Không tìm thấy đơn hàng với mã đã cung cấp',
                    ], 404);
                }
            }

            $orders = Order::where('tel', $search)->orderByDesc('created_at')->get();

            if ($orders->count() > 0) {
                foreach ($orders as $order) {
                    $order->name = $this->maskName($order->name);
                    $order->tel = $this->maskTel($order->tel);
                    $order->address = $this->maskAddress($order->address);
                }

                return response()->json([
                    'status' => 'success',
                    'orders' => $orders,
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đơn hàng với số điện thoại đã cung cấp',
                ], 404);
            }
        } catch (\Throwable $th) {
            Log::error($th->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi kiểm tra đơn hàng',
            ], 500);
        }
    }

    // validate * name
    private function maskName($name)
    {
        return preg_replace('/\S/', '*', substr($name, 0, -4)) . substr($name, -4);
    }


    // validate * số đinej thoại
    private function maskTel($tel)
    {
        return str_repeat('*', strlen($tel) - 3) . substr($tel, -3);
    }


     // validate * địa chỉ
    private function maskAddress($address)
    {
        $visiblePart = substr($address, -8);  
        $maskedPart = str_repeat('*', strlen($address) - 8);  

        return $maskedPart . $visiblePart;
    }



    public function getEventCoupons(Request $request)
    {
        // Lấy thông tin người dùng
        $user = $request->user();

        // Truy vấn các coupon đã nhận của người dùng với loại là 'event'
        $eventCoupons = CouponUser::where('user_id', $user->id)
            ->whereNull('used_at') // Kiểm tra xem coupon chưa được sử dụng
            ->join('coupons', 'coupon_users.coupon_id', '=', 'coupons.id')
            ->where('coupons.type', 'event')
            ->select('coupon_users.coupon_id', 'coupons.*', \DB::raw('COUNT(coupon_users.coupon_id) as total_count')) // Đếm số lượng coupon
            ->groupBy('coupon_users.coupon_id') // Nhóm theo coupon_id
            ->get();

        return response()->json([
            'event_coupons' => $eventCoupons,
        ]);
    }





}
