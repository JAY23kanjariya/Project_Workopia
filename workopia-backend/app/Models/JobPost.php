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
        'status',
        'employment_type',
        'city',
        'state',
        'country',
        'work_mode',
        'salary_type',
        'min_salary',
        'max_salary',
        'required_skills',
        'min_experience',
        'max_experience',
        'education_qualification',
        'openings_count',
        'application_deadline',
        'company_name',
        'company_description',
        'company_website'
    ];

    protected $casts = [
        'application_deadline' => 'date',
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'openings_count' => 'integer',
        'min_experience' => 'integer',
        'max_experience' => 'integer',
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

    // A job post has many applications
    public function applications()
    {
        return $this->hasMany(Application::class, 'job_post_id');
    }
}
