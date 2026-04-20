<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Employer\JobPostController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CandidateInformationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    // Common for all authenticated users
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']); 
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);
    Route::delete('/delete-account', [AuthController::class, 'deleteAccount']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    // Job Posts :- Anyone logged in
    Route::get('/job-posts', [JobPostController::class, 'index']);
    Route::get('/job-posts/{id}', [JobPostController::class, 'show']);

    // Admin middleware
    Route::middleware('isAdmin')->group(function () {
        // Category management routes for Admin
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Job post management routes for Admin
        Route::delete('/admin/job-posts/{id}', [JobPostController::class, 'destroy']);

        // Dashboard route for Admin
        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard']);

        // User management routes for Admin
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    });

    // Employer middleware
    Route::middleware('isEmployer')->group(function () {
        // Job post management routes for Employers
        Route::get('/employer/job-posts', [JobPostController::class, 'EmployeePostedJobs']);
        Route::post('/job-posts', [JobPostController::class, 'store']);
        Route::put('/job-posts/{id}', [JobPostController::class, 'update']);
        Route::delete('/job-posts/{id}', [JobPostController::class, 'destroy']);

        // Application management routes for Employers
        Route::get('/job-posts/{jobId}/applications', [ApplicationController::class, 'jobApplications']);
        Route::put('/applications/{id}/status', [ApplicationController::class, 'updateStatus']);

        // Dashboard route for Employers
        Route::get('/employer/dashboard', [DashboardController::class, 'employerDashboard']);
    });

    // Candidate middleware
    Route::middleware('isCandidate')->group(function () {
        // Application management routes for Candidates
        Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
        Route::post('/job-posts/{jobId}/apply', [ApplicationController::class, 'apply']);

        // Dashboard route for Candidates
        Route::get('/candidate/dashboard', [DashboardController::class, 'candidateDashboard']);

        // Candidate profile management
        Route::get('/candidate/profile', [CandidateInformationController::class, 'showProfile']);
        Route::post('/candidate/profile', [CandidateInformationController::class, 'store']);
    });

    // Resource routes accessible by others (Admin/Employer)
    Route::apiResource('candidate-information', CandidateInformationController::class)->except(['store']);
});
