<?php

// app/Console/Commands/UnlockLockedItems.php

namespace App\Console\Commands;

use App\Models\InventoryStock;
use App\Models\LockedItem;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;

class UnlockLockedItems extends Command
{
    protected $signature = 'app:unlock-locked-items'; // Đảm bảo tên đúng

    protected $description = 'Unlock items that have exceeded the expiration time and update inventory stock.';

    public function handle()
{
    while (true) {  // Vòng lặp vô hạn để kiểm tra liên tục
        $expirationTime = Carbon::now()->subMinutes(10); // Kiểm tra các bản ghi đã hết hạn từ 10 phút trước

        // Lấy các bản ghi bị khóa đã quá hạn
        $expiredItems = LockedItem::where('locked_at', '<', $expirationTime)->get();

        if ($expiredItems->isEmpty()) {
            $this->info('No expired items found.');
        } else {
            foreach ($expiredItems as $item) {
                // Khôi phục tồn kho
                $inventory = InventoryStock::where('variant_id', $item->variant_id)->first();
                if ($inventory) {
                    $inventory->quantity += $item->quantity;
                    $inventory->save();
                }

                // Xóa bản ghi bị khóa
                $item->delete();

                // Phát sự kiện Realtime qua Pusher (nếu cần)
                $this->sendPusherNotification($item->variant_id, $inventory->quantity);
            }

            $this->info('Unlocked expired items successfully!');
        }

        // Đợi 1 phút trước khi tiếp tục kiểm tra
        sleep(60);
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
