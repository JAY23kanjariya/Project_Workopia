<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateInformation extends Model
{
    protected $table = 'candidate_information';

    protected $fillable = [
        'user_id',
        'phone_number',
        'degree',
        'specialization',
        'college_name',
        'cgpa',
        'experience',
        'resume_link',
        'bio',
        'portfolio_link',
        'linkedin_link',
        'github_link',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
