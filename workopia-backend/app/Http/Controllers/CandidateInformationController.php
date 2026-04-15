<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCandidateInformationRequest;
use App\Http\Requests\UpdateCandidateInformationRequest;
use App\Http\Resources\CandidateInformationResource;
use App\Models\CandidateInformation;
use App\Services\CandidateInformationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CandidateInformationController extends Controller
{
    protected $service;

    public function __construct(CandidateInformationService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CandidateInformationResource::collection(CandidateInformation::with('user')->paginate());
    }

    /**
     * Store or Update the current user's candidate information.
     */
    public function store(StoreCandidateInformationRequest $request): CandidateInformationResource
    {
        $info = $this->service->updateOrCreate($request->validated(), Auth::id());
        return new CandidateInformationResource($info);
    }

    /**
     * Display the current user's candidate information.
     */
    public function showProfile(): CandidateInformationResource|JsonResponse
    {
        $info = $this->service->getForUser(Auth::id());
        
        if (!$info) {
            return response()->json(['message' => 'Candidate profile not found.'], 404);
        }

        return new CandidateInformationResource($info);
    }

    /**
     * Display the specified resource.
     */
    public function show(CandidateInformation $candidateInformation): CandidateInformationResource
    {
        return new CandidateInformationResource($candidateInformation->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCandidateInformationRequest $request, CandidateInformation $candidateInformation): CandidateInformationResource
    {
        $candidateInformation->update($request->validated());
        return new CandidateInformationResource($candidateInformation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CandidateInformation $candidateInformation): JsonResponse
    {
        $candidateInformation->delete();
        return response()->json(['message' => 'Candidate information deleted successfully.']);
    }
}
