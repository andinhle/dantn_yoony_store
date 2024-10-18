<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelName extends Model
{
    use HasFactory;
    protected $table = 'models'; 

    protected $fillable = ['name', 'type'];


    // Một model có thể có nhiều vai trò qua bảng trung gian role_has_models
    public function roleHasModels()
    {
        return $this->hasMany(RoleHasModel::class);
    }
}
