<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tel',
        'address',
        'avatar',
        'provider',
        'provider_id',
        'provider_token',
        'remember_token',
        'role_id', 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class, 'user_id', 'id');
    }

    // Mỗi người dùng thuộc về một vai trò
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function coupons() {
        return $this->belongsToMany(Coupon::class, 'coupon_user');
    }
}