<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    use HasFactory;

    protected $fillable = [
        'price',
        'sale_price',
        'quantity',
        'product_id '
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function variantAttributeValues()
    {
        return $this->hasMany(VariantAttributeValues::class);
    }
}
