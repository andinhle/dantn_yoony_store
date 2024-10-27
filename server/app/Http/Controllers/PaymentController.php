<?php

namespace App\Http\Controllers;

use App\Services\VNPAYService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $vnpayService;

    public function __construct(VNPAYService $vnpayService)
    {
        $this->vnpayService = $vnpayService;
    }

    public function createPayment(Request $request)
    {
        $amount = 100000; // Số tiền thanh toán
        $orderId = uniqid(); // ID đơn hàng
        $orderInfo = 'Thanh toán cho đơn hàng';

        $paymentUrl = $this->vnpayService->createPaymentUrl($amount, $orderId, $orderInfo);
        
        return redirect($paymentUrl);
    }

    public function callback(Request $request)
    {
        // Xử lý callback từ VNPAY
        $vnp_SecureHash = $request->input('vnp_SecureHash');
        unset($request['vnp_SecureHash']);
        unset($request['vnp_SecureHashType']);

        // Tạo chữ ký từ các tham số
        ksort($request);
        $query = http_build_query($request->all());
        $signature = hash_hmac('sha512', $query, $this->vnpayService->getHashSecret());

        if ($vnp_SecureHash === $signature) {
            // Chữ ký hợp lệ, kiểm tra trạng thái giao dịch
            if ($request->input('vnp_ResponseCode') === '00') {
                // Giao dịch thành công
                // Xử lý đơn hàng tại đây
                return response()->json(['message' => 'Thanh toán thành công']);
            } else {
                // Giao dịch thất bại
                return response()->json(['message' => 'Thanh toán thất bại']);
            }
        } else {
            // Chữ ký không hợp lệ
            return response()->json(['message' => 'Chữ ký không hợp lệ']);
        }
    }
}