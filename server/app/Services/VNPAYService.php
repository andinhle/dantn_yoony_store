<?php 
namespace App\Services;

use Illuminate\Support\Facades\Http;

class VNPAYService
{
    protected $merchantId;
    protected $hashSecret;
    protected $vnpUrl;

    public function __construct()
    {
        $this->merchantId = config('vnpay.merchant_id');
        $this->hashSecret = config('vnpay.hash_secret');
        $this->vnpUrl = config('vnpay.vnp_url');
    }

    public function getHashSecret()
    {
        return $this->hashSecret;
    }

    public function createPaymentUrl($amount, $orderId, $orderInfo)
    {
        $vnp_Params = [];
        $vnp_Params['vnp_Version'] = '2.0.0';
        $vnp_Params['vnp_Command'] = 'pay';
        $vnp_Params['vnp_TmnCode'] = $this->merchantId;
        $vnp_Params['vnp_Amount'] = $amount * 100; 
        $vnp_Params['vnp_CurrCode'] = 'VND';
        $vnp_Params['vnp_TxnRef'] = $orderId;
        $vnp_Params['vnp_OrderInfo'] = $orderInfo;
        $vnp_Params['vnp_ReturnUrl'] = route('payment.callback');
        $vnp_Params['vnp_CreateDate'] = date('YmdHis');

        // Thêm các thông tin khác nếu cần thiết

        // Tạo chữ ký
        ksort($vnp_Params);
        $query = http_build_query($vnp_Params);
        $signature = hash_hmac('sha512', $query, $this->hashSecret);
        $vnp_Params['vnp_SecureHash'] = $signature;

        return $this->vnpUrl . '?' . http_build_query($vnp_Params);
    }
}