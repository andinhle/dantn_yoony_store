<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelName extends Model
{
    use HasFactory;
    protected $table = 'models'; 

    protected $fillable = ['name', 'type'];

    // Tự động trim giá trị type khi lấy từ database
    protected function getTypeAttribute($value)
    {
        return trim($value);
    }

    public function roleHasModels()
    {
        return $this->hasMany(RoleHasModel::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_models', 'model_id', 'role_id');
    }
}