<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Category;
use App\Models\JobPost;
use App\Models\Application;

class DashboardController extends Controller
{
    //Admin dashboard data
    public function adminDashboard()
    {
        $totalUsers = User::count();
        $totalCategories = Category::count();
        $totalJobPosts = JobPost::count();
        $totalApplications = Application::count();

        return response()->json([
            'success' => true,
            'totalUsers' => $totalUsers,
            'totalCategories' => $totalCategories,
            'totalJobPosts' => $totalJobPosts,
            'totalApplications' => $totalApplications,
        ], 200);
    }

    //Employer dashboard data
    public function employerDashboard(Request $request)
    {
        $employerId = $request->user()->id;
        $totalJobPosts = JobPost::where('employer_id', $employerId)->count();
        $totalApplications = Application::whereHas('jobPost', function ($query) use ($employerId) {
            $query->where('employer_id', $employerId);
        })->count();    

        return response()->json([
            'success' => true,
            'totalJobPosts' => $totalJobPosts,
            'totalApplications' => $totalApplications,
        ], 200);
    }
    
    //Candidate dashboard data
    public function candidateDashboard(Request $request)
    {
        $candidateId = $request->user()->id;
        $totalApplications = Application::where('candidate_id', $candidateId)->count();

        return response()->json([
            'success' => true,
            'totalApplications' => $totalApplications,
        ], 200);
    }
}
