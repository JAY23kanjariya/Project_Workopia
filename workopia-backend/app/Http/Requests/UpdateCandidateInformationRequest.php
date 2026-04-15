<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCandidateInformationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:20'],
            'degree' => ['sometimes', 'required', 'string', 'max:255'],
            'specialization' => ['sometimes', 'nullable', 'string', 'max:255'],
            'college_name' => ['sometimes', 'required', 'string', 'max:255'],
            'cgpa' => ['sometimes', 'nullable', 'numeric', 'between:0,10.00'],
            'experience' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'resume_link' => ['sometimes', 'nullable', 'string', 'url'],
            'bio' => ['sometimes', 'nullable', 'string'],
            'portfolio_link' => ['sometimes', 'nullable', 'url'],
            'linkedin_link' => ['sometimes', 'nullable', 'url'],
            'github_link' => ['sometimes', 'nullable', 'url'],
        ];
    }
}
