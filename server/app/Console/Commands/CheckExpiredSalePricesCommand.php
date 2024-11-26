<?php

// app/Console/Commands/CheckExpiredSalePricesCommand.php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\CheckExpiredSalePrices;
use App\Models\Product;

class CheckExpiredSalePricesCommand extends Command
{
    // protected $signature = 'sale:check-expired';
    // protected $description = 'Check and update expired sale prices every second';

    public function handle()
    {
        // while (true) {
        //     $products = Product::with('variants')->get();

        //     foreach ($products as $product) {
        //         foreach ($product->variants as $variant) {
        //             event(new CheckExpiredSalePrices($variant));
        //         }
        //     }

        //     // Chờ 1 giây trước khi kiểm tra lại
        //     sleep(1); // Chạy lại sau mỗi giây
        // }
    }
}
