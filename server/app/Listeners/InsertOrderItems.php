<?php

namespace App\Listeners;

use App\Events\OrderShipped;
use App\Models\InventoryStock;
use App\Models\OrderItem;
use App\Models\OrderItemAttribute;
use App\Models\OrderItemAttributeValue;
use App\Models\Variant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class InsertOrderItems
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

        $orderId = $event->order->id;
        $objectData =$event->order->items;
        \Log::info( $objectData );
        
        $orderItems = [];
        
        foreach ($objectData as $value) {
                $orderItem['order_id'] = $orderId;
                $orderItem['variant_id'] = $value->variant->id;
                $orderItem['order_item_attribute'] = json_encode($value->variant->attribute_values);
                $orderItem['product_name'] = $value->variant->product->name;
                $orderItem['product_image'] = json_encode($value->variant->image) ?? json_encode($value->variant->product->images[0]) ;
                $orderItem['quantity'] = $value->quantity;
                $orderItem['unit_price'] = $value->variant->sale_price ?: $value->variant->price;
                $orderItem['total_price'] = $value->quantity * ($value->variant->sale_price ?: $value->variant->price);

                $orderItems[] = $orderItem;

            InventoryStock::query()
            ->where('variant_id', $value->variant_id)
            ->decrement('quantity', $value->quantity); 

            OrderItem::insert($orderItems);

        }           
    }
}