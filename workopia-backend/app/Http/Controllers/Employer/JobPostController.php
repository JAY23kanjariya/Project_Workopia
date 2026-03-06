<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\JobPost;

class JobPostController extends Controller
{
    // 🔹 View Jobs (All logged in users)
    public function index(Request $request)
    {

        // Get all job posts with category and employer details
        $query = JobPost::with('category', 'employer');

        // Apply filters for Search by Title
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        // Apply filters for Filter by Category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // return paginated results (10 per page)
        $jobPosts = $query->latest()->paginate(10);

        // Return response
        return response()->json([
            'success' => true,
            'jobPosts' => $jobPosts
        ], 200);
    }

    // 🔹 Create Job Post (Employer only)
    public function store(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'required|boolean',
        ]);

        // send validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create new job post
        $jobPost = JobPost::create([
            'title' => $request->title,
            'category_id' => $request->category_id, 
            'location' => $request->location,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Job post created successfully.',
            'jobPost' => $jobPost
        ], 200);
    }

    // 🔹 Get Single Job Post (All logged in users)
    public function show($id)
    {
        // Find job post by ID
        $jobPost = JobPost::with('category', 'employer')->find($id);

        // If job post not found, return error
        if (!$jobPost) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found.'  
            ], 404);
        }

        // Return response
        return response()->json([
            'success' => true,
            'jobPost' => $jobPost
        ], 200);
    }

    // 🔹 Update Job Post (Employer only)
    public function update(Request $request, $id)
    {
        // Find job post by ID
        $jobPost = JobPost::find($id);

        // If job post not found, return error
        if (!$jobPost) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found.'  
            ], 404);
        }

        // Validate request data
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'category_id' => 'sometimes|required|exists:categories,id',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|required|boolean',
        ]);

        // send validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update job post fields if provided
        $jobPost->update($request->only(['title', 'category_id', 'location', 'description', 'status']));

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Job post updated successfully.',
            'jobPost' => $jobPost
        ], 200);
    }

    // 🔹 Delete Job Post (Employer only)
    public function destroy($id)
    {
        // Find job post by ID
        $jobPost = JobPost::find($id);

        // If job post not found, return error
        if (!$jobPost) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found.'  
            ], 404);
        }

        // Delete job post
        $jobPost->delete();

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Job post deleted successfully.'
        ], 200);
    }
}
