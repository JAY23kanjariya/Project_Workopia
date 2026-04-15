<?php

namespace App\Services;

use App\Models\CandidateInformation;
use Illuminate\Support\Facades\Auth;

class CandidateInformationService
{
    /**
     * Get candidate information for a user.
     */
    public function getForUser(int $userId)
    {
        return CandidateInformation::where('user_id', $userId)->first();
    }

    /**
     * Create or update candidate information.
     */
    public function updateOrCreate(array $data, int $userId)
    {
        return CandidateInformation::updateOrCreate(
            ['user_id' => $userId],
            $data
        );
    }

    /**
     * Delete candidate information.
     */
    public function delete(int $userId)
    {
        $info = CandidateInformation::where('user_id', $userId)->first();
        if ($info) {
            return $info->delete();
        }
        return false;
    }
}
