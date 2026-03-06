<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    protected $fillable = [
        'job_post_id',
        'candidate_id',
        'status'
    ];

    // Relationships
    // An application belongs to a job post
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }
    // An application belongs to a candidate (user)
    public function candidate()
    {   
        return $this->belongsTo(User::class, 'candidate_id');
    }
}
