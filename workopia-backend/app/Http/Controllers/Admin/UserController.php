<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\AccountDeletedEmail;

class UserController extends Controller
{
    /**
     * Get all users with pagination and roles.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Apply filters for Search by Name or Email
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Return paginated results (10 per page)
        $users = $query->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'users' => $users
        ], 200);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.'
            ], 404);
        }

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account.'
            ], 403);
        }

        // Send Account Deleted Email
        Mail::to($user->email)->send(new AccountDeletedEmail($user));

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.'
        ], 200);
    }
}
