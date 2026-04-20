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
            'applications_count' => $this->applications_count ?? $this->applications()->count(),
            'has_applied' => auth('sanctum')->check() 
                ? $this->applications()->where('candidate_id', auth('sanctum')->id())->exists() 
                : false,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
        ];
    }
}
