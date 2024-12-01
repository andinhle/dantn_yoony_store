<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryImport extends Model
{
    use HasFactory;
    protected $fillable = ['import_price', 'quantity', 'variant_id', 'supplier_id','batch_number'];
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
