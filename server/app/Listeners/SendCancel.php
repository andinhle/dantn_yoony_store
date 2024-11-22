<?php

namespace App\Listeners;

use App\Events\OrderCanceled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendCancel implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderCanceled $event): void
    {
        $orderData = json_decode($event->order); // Nếu đã dispatch là đối tượng

        Log::info('order', (array) $event->order->items);
        $user = $event->order->user;
        $user['order_code'] = $orderData->code;
        Mail::send('orderCanceled', [
            'order' =>  $event->order,
            'variant' =>  $event->order->items
        ], function($message) use ($user) 
        {
            $message->to($user->email, $user->name)
                ->from('yoony_store@gmail.com', 'Yoony Store')
                ->subject('Xác nhận hủy đơn hàng '. $user->order_code .' từ CTY CP YOONY STORE VIỆT NAM');
        });
    }
}