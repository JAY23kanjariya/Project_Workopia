<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\JobPost;
use Illuminate\Support\Facades\Mail;
use App\Mail\JobAppliedEmail;

class ApplicationController extends Controller
{
    // 🔹 Candidate applies for job
    public function apply(Request $request, $jobPostId)
    {
        // Find job post by ID
        $jobPost = JobPost::findOrFail($jobPostId);

        // Check if candidate has already applied for this job
        $existingApplication = Application::where('job_post_id', $jobPostId)
            ->where('candidate_id', $request->user()->id)
            ->exists();

        // If already applied, return error response
        if ($existingApplication) {
            return response()->json([
                'success' => false,
                'message' => 'You have already applied for this job.'
            ], 400);
        }

        // Create new application
        $application = Application::create([
            'job_post_id' => $jobPostId,
            'candidate_id' => $request->user()->id,
            'status' => 'Pending', // Pending, Approved, Rejected
        ]);

        // Send Job Applied Email
        $jobPost->load('employer');
        Mail::to($request->user()->email)->send(new JobAppliedEmail($request->user(), $jobPost));

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully.',
            'application' => $application
        ], 200);
    }

     // 🔹 Candidate views their applications
     public function myApplications(Request $request)
     {
         // Get applications for the logged-in candidate
         $applications = Application::with('jobPost')
             ->where('candidate_id', $request->user()->id)
             ->latest()
             ->get();
 
         // Return response
         return response()->json([
             'success' => true,
             'applications' => $applications
         ], 200);
     }

     // 🔹 Employer views applications for their job
     public function jobApplications(Request $request, $jobPostId)
     {
         // Find job post by ID
         $jobPost = JobPost::findOrFail($jobPostId);

         // Check if the logged-in user is the employer who posted the job
         if ($jobPost->employer_id !== $request->user()->id) {
             return response()->json([
                 'success' => false,
                 'message' => 'Unauthorized access to applications.'
             ], 403);
         }

         // Get applications for the job post
         $applications = Application::with(['candidate.candidateInformation'])
             ->where('job_post_id', $jobPostId)
             ->latest()
             ->get();

         // Return response
         return response()->json([
             'success' => true,
             'applications' => $applications
         ], 200);
     }

    // 🔹 Employer updates application status
    public function updateStatus(Request $request, $applicationId)
    {
        // Find application by ID
        $application = Application::findOrFail($applicationId);

        // Check if the logged-in user is the employer who posted the job
        $jobPost = JobPost::findOrFail($application->job_post_id);

        // Unauthorized if not the employer who posted the job
        if ($jobPost->employer_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to update application status.'
            ], 403);
        }

        // Validate and update status
        $validatedData = $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected'
        ]);

        // Update status
        $application->update($validatedData);

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully.',
            'application' => $application
        ], 200);
    }
}
