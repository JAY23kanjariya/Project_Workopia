<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateInformationRequest extends FormRequest
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
            'phone_number' => ['nullable', 'string', 'max:20'],
            'degree' => ['required', 'string', 'max:255'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'college_name' => ['required', 'string', 'max:255'],
            'cgpa' => ['nullable', 'numeric', 'between:0,10.00'],
            'experience' => ['nullable', 'numeric', 'min:0'],
            'resume_link' => ['nullable', 'string', 'url'],
            'bio' => ['nullable', 'string'],
            'portfolio_link' => ['nullable', 'url'],
            'linkedin_link' => ['nullable', 'url'],
            'github_link' => ['nullable', 'url'],
        ];
    }
}
