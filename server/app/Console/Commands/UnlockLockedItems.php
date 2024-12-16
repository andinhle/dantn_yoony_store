<?php

namespace App\Console\Commands;

use App\Models\InventoryStock;
use App\Models\LockedItem;
use App\Models\Coupon;
use App\Models\CouponUser;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;

class UnlockLockedItems extends Command
{
    protected $signature = 'app:unlock-locked-items';

    protected $description = 'Unlock items that have exceeded the expiration time and update inventory stock, and restore coupon usage.';

    public function handle()
    {
        while (true) {
            $expirationTime = Carbon::now()->subMinutes(15);

            $expiredItems = LockedItem::where('locked_at', '<', $expirationTime)->get();

            if ($expiredItems->isEmpty()) {
                $this->info('No expired items found.');
            } else {
                foreach ($expiredItems as $item) {
                    $inventory = InventoryStock::where('variant_id', $item->variant_id)->first();
                    if ($inventory) {
                        $inventory->quantity += $item->quantity;
                        $inventory->save();
                    }

                    $this->restoreCouponUsage($item);

                    $item->delete();

                    $this->sendPusherNotification($item->variant_id, $inventory->quantity);
                }

                $this->info('Unlocked expired items and restored coupons successfully!');
            }

            sleep(60);
        }
    }

public function restoreCouponUsage($item)
{
    $cart = $item->cart; 
    if ($cart && $cart->coupon_id) {
        $coupon = Coupon::find($cart->coupon_id);
        if ($coupon) {
            $couponUser = CouponUser::where('user_id', $cart->user_id)
                                    ->where('coupon_id', $coupon->id)
                                    ->first();
            if ($couponUser && !$couponUser->used_at) {
                $coupon->usage_limit += 1;
                $coupon->save();

                $couponUser->delete();
            }
        }
    }
}


    public function sendPusherNotification($variantId, $quantity)
    {
        $pusher = new Pusher(
            env('PUSHER_KEY'),
            env('PUSHER_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_CLUSTER'),
                'useTLS' => true
            ]
        );

        $data = [
            'variant_id' => $variantId,
            'quantity' => $quantity
        ];

        // Gửi sự kiện "inventory_updated" tới channel "product-channel"
        $pusher->trigger('product-channel', 'inventory-updated', $data);
    }
}
