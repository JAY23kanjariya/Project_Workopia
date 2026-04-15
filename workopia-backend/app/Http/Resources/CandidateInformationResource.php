<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateInformationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'phone_number' => $this->phone_number,
            'degree' => $this->degree,
            'specialization' => $this->specialization,
            'college_name' => $this->college_name,
            'cgpa' => $this->cgpa,
            'experience' => $this->experience,
            'resume_link' => $this->resume_link,
            'bio' => $this->bio,
            'portfolio_link' => $this->portfolio_link,
            'linkedin_link' => $this->linkedin_link,
            'github_link' => $this->github_link,
            'user' => $this->whenLoaded('user'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
