<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

     // Một vai trò có thể có nhiều người dùng
     public function users()
     {
         return $this->hasMany(User::class);
     }

      // Một vai trò có thể có nhiều models qua bảng trung gian role_has_models
    public function roleHasModels()
    {
        return $this->hasMany(RoleHasModel::class);
    }
}
