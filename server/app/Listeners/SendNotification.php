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
        

        
   
        Mail::send('orderShipperdMail', [
            'name' => $user->name,
            'order' => $event->order,
            'variant' => $event->variant
        ], function($message) use ($user) 
        {
            $message->to($user->email, $user->name)
            ->from('yoony_store@gmail.com ', 'Yoony Store')
            ->subject
                ('Yoony Store');
        });
     
        
    }
}