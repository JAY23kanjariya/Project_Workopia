<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'location' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'status' => ['required', 'boolean'],
            
            // New Fields
            'employment_type' => ['required', 'string', 'in:Full-time,Part-time,Internship,Contract'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'work_mode' => ['required', 'string', 'in:On-site,Remote,Hybrid'],
            'salary_type' => ['required', 'string', 'in:Fixed,Range,Negotiable'],
            'min_salary' => ['nullable', 'numeric', 'min:0'],
            'max_salary' => ['nullable', 'numeric', 'min:0', 'gte:min_salary'],
            'required_skills' => ['required', 'string'],
            'min_experience' => ['nullable', 'integer', 'min:0'],
            'max_experience' => ['nullable', 'integer', 'min:0', 'gte:min_experience'],
            'education_qualification' => ['required', 'string', 'max:255'],
            'openings_count' => ['required', 'integer', 'min:1'],
            'application_deadline' => ['nullable', 'date', 'after:today'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_description' => ['required', 'string'],
            'company_website' => ['nullable', 'url', 'max:255'],
        ];
    }
}
