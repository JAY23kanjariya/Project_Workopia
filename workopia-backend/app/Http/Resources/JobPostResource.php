<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category_id' => $this->category_id,
            'employer_id' => $this->employer_id,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,
            'employer' => $this->employer ? [
                'id' => $this->employer->id,
                'name' => $this->employer->name,
                'email' => $this->employer->email,
            ] : null,
            'location' => $this->location,
            'description' => $this->description,
            'status' => (bool) $this->status,
            'employment_type' => $this->employment_type,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'work_mode' => $this->work_mode,
            'salary_type' => $this->salary_type,
            'min_salary' => $this->min_salary,
            'max_salary' => $this->max_salary,
            'required_skills' => $this->required_skills,
            'min_experience' => $this->min_experience,
            'max_experience' => $this->max_experience,
            'education_qualification' => $this->education_qualification,
            'openings_count' => $this->openings_count,
            'application_deadline' => $this->application_deadline ? $this->application_deadline->format('Y-m-d') : null,
            'company_name' => $this->company_name,
            'company_description' => $this->company_description,
            'company_website' => $this->company_website,
            'applications_count' => $this->applications_count ?? $this->applications()->count(),
            'has_applied' => auth('sanctum')->check() 
                ? $this->applications()->where('candidate_id', auth('sanctum')->id())->exists() 
                : false,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
