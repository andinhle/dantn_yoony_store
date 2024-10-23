<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    // protected $fillable = ['text','is_active'];

    protected $fillable = ['text', 'answer_id'];

    public function answer()
    {
        return $this->belongsTo(Answer::class, 'answer_id');
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }


}
