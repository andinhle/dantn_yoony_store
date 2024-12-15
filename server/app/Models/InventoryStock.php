<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryStock extends Model
{
    use HasFactory;
    protected $fillable = ['quantity', 'variant_id','reserved_stock','available_stock','last_updated'];
    public function reserveStock($quantity)
    {
        if ($this->available_stock < $quantity) {
            throw new \Exception('Không đủ hàng tồn kho.');
        }

        $this->available_stock -= $quantity;
        $this->reserved_stock += $quantity;
        $this->last_updated = now();
        $this->save();
    }
    public function releaseStock($quantity)
    {
        $this->reserved_stock -= $quantity;
        $this->available_stock += $quantity;
        $this->last_updated = now();
        $this->save();
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}