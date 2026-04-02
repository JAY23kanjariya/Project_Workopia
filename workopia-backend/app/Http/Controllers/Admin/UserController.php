<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Get all users with pagination and roles.
     */
    public function index(Request $request)
    {
        // // Get all job posts with category and employer details
        // $query = User::with('name');

        // // Apply filters for Search by Name
        // if ($request->has('name')) {
        //     $query->where('name', 'like', '%' . $request->name . '%');
        // }


        // // return paginated results (10 per page)
        // $users = $query->latest()->paginate(10);

        $users = User::all();

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

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.'
        ], 200);
    }
}
