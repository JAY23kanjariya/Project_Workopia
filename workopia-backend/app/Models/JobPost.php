<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\User;

class JobPost extends Model
{
    protected $fillable = [
        'title',
        'category_id',
        'employer_id',
        'location',
        'description',
        'status'
    ];

    // Relationships 
    // A job post belongs to a category 
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // A job post belongs to an employer (user)
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}

