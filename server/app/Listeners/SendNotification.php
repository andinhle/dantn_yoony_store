<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class SendNotification
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
    public function handle(OrderShipped $event): void
    {
        $user = Auth::user();
        
        $data = [
            'name' => $user->name,
            'orderDetails' => $event, 
        ];
        
        
   
        Mail::send('orderShipperdMail', $data, function($message) use ($user) 
        {
            $message->to($user->name, $user->email)
            ->subject
                ('Laravel Basic Testing Mail');
        });
     
        
    }
}