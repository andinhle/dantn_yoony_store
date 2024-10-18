<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleHasModel extends Model
{
    protected $table = 'role_has_models';
    protected $fillable = [
        'role_id',
        'model_id',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function model()
    {
        return $this->belongsTo(ModelType::class, 'model_id');
    }
}
