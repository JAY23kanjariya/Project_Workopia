<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'location' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', 'boolean'],

            // New Fields
            'employment_type' => ['sometimes', 'required', 'string', 'in:Full-time,Part-time,Internship,Contract'],
            'city' => ['sometimes', 'required', 'string', 'max:255'],
            'state' => ['sometimes', 'required', 'string', 'max:255'],
            'country' => ['sometimes', 'required', 'string', 'max:255'],
            'work_mode' => ['sometimes', 'required', 'string', 'in:On-site,Remote,Hybrid'],
            'salary_type' => ['sometimes', 'required', 'string', 'in:Fixed,Range,Negotiable'],
            'min_salary' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'max_salary' => ['sometimes', 'nullable', 'numeric', 'min:0', 'gte:min_salary'],
            'required_skills' => ['sometimes', 'required', 'string'],
            'min_experience' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_experience' => ['sometimes', 'nullable', 'integer', 'min:0', 'gte:min_experience'],
            'education_qualification' => ['sometimes', 'required', 'string', 'max:255'],
            'openings_count' => ['sometimes', 'required', 'integer', 'min:1'],
            'application_deadline' => ['sometimes', 'nullable', 'date', 'after:today'],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'company_description' => ['sometimes', 'required', 'string'],
            'company_website' => ['sometimes', 'nullable', 'url', 'max:255'],
        ];
    }
}
