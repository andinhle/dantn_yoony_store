<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleHasModel extends Model
{
    use HasFactory;
    protected $table = 'role_has_models'; 

    protected $fillable = ['role_id', 'model_id'];

    // Mỗi bản ghi thuộc về một vai trò
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Mỗi bản ghi thuộc về một model
    public function modelName()
    {
        return $this->belongsTo(ModelName::class, 'model_id');
    }
}