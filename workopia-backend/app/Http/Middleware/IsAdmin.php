<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // check if user is admin
        if ($request->user()->role_id != 1) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to access this page.',
            ], 403);
        }
        return $next($request);
    }
}
