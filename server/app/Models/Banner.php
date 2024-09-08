<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;


    protected $fillable = ['image','is_active'];

    // public function users(){
    //     return $this->hasMany(User::class);
    // }
}
