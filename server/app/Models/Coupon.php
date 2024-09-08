<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $table = 'coupons'; 

    protected $fillable = [
        'code',
        'discount',
        'discount_type',
        'usage_limit',
        'start_date',
        'end_date',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_featured' => 'boolean',
    ];
}