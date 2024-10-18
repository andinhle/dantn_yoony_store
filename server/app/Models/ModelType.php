<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelType extends Model
{
    use HasFactory;
    
    protected $table = 'models'; 
    
    protected $fillable = ['name', 'type'];

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_has_models', 'model_id', 'role_id');
    }
}