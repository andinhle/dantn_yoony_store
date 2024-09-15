<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name','slug','images','description','category_id','is_featured','is_good_deal','is_active'];
    

    public function variants(){
        return $this->hasMany(Variant::class);
    }
    public function category(){
        return $this->belongsTo(Category::class);
    }
}
