<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsEmployer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if user is employer
        if ($request->user()->role_id != 2) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to access this page.',
            ], 403);
        }
        return $next($request);
    }
}
