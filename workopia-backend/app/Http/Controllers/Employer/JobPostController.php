<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\StoreJobPostRequest;
use App\Http\Requests\Employer\UpdateJobPostRequest;
use App\Http\Resources\JobPostResource;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobPostController extends Controller
{

    /**
     * Display only the job posts created by the currently authenticated employee.
     */
    public function EmployeePostedJobs(Request $request): JsonResponse
    {
        $query = $request->user()->jobPosts()->with(['category', 'employer']);

        // Filter by 'search' or 'title' parameter
        $search = $request->get('search') ?? $request->get('title');
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        $paginator = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'jobPosts' => [
                'data' => JobPostResource::collection($paginator->items()),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ]
        ]);
    }

    /**
     * Display a listing of all active job posts (Public/Candidate view).
     */
    public function index(Request $request): JsonResponse
    {
        $query = JobPost::with(['category', 'employer'])->where('status', 1);

        // Filter by 'search' or 'title' parameter
        $search = $request->get('search') ?? $request->get('title');
        if ($search) {
            $query->where('title', 'like', '%' . $search . '%');
        }

        // Apply additional filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $paginator = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'jobPosts' => [
                'data' => JobPostResource::collection($paginator->items()),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ]
        ]);
    }

    /**
     * Store a newly created job post.
     */
    public function store(StoreJobPostRequest $request): JsonResponse
    {
        $jobPost = $request->user()->jobPosts()->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Job post created successfully.',
            'data' => new JobPostResource($jobPost->load(['category', 'employer']))
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $jobPost = JobPost::with(['category', 'employer'])
            ->withCount('applications')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'jobPost' => new JobPostResource($jobPost)
        ]);
    }

    /**
     * Update the specified job post.
     */
    public function update(UpdateJobPostRequest $request, $id): JsonResponse
    {
        $jobPost = $request->user()->jobPosts()->findOrFail($id);
        
        $jobPost->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Job post updated successfully.',
            'jobPost' => new JobPostResource($jobPost->load(['category', 'employer']))
        ]);
    }

    /**
     * Remove the specified job post.
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $jobPost = $request->user()->jobPosts()->findOrFail($id);
        
        $jobPost->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job post deleted successfully.'
        ]);
    }
}
