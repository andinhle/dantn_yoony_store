<?php

namespace App\Events;


use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Support\Facades\Log;

class CheckExpiredSalePrices
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct()
    {
            Log::info('Event CheckExpiredSalePrices triggered!');

    }
}
