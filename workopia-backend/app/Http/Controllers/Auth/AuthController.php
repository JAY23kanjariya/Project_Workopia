<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;


class AuthController extends Controller
{
    //REGISTER
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error.',
                'data' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id
        ]);

        // Send Welcome Email
        Mail::to($user->email)->send(new WelcomeEmail($user));

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 201);
    }

    //LOGIN
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error.',
                'data' => $validator->errors()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Email or password is incorrect',
            ], 401);
        }

        $user = User::where('email', $request->email)->first();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully.',
            'data' => [
                'user' => $user,
                'token' => $token
            ]
        ], 200)->cookie(
                'token',
                $token,
                60 * 24, // 1 day
                '/',
                null,     
                false,    // secure (false for localhost)
                false,    // httpOnly: set to false so frontend can read it
                false,
                'Lax'     
            )->cookie(
                'user',
                json_encode($user),
                60 * 24,
                '/',
                null,
                false,
                false,    // httpOnly: set to false
                false,
                'Lax'
            );
    }

    //LOGOUT
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'User logged out successfully.',
        ], 200)
        ->withoutCookie('token')
        ->withoutCookie('user');
    }

    // ME
    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'message' => 'User fetched successfully.',
            'data' => $user
        ], 200);
    }

    /**
     * Update user profile (name, email).
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only('name', 'email'));

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user' => $user
        ], 200);
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error.',
                'errors' => $validator->errors()
            ], 422);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password does not match.',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ], 200);
    }

    /**
     * Delete user account (non-admin only).
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        // Prevent admin from deleting their account
        if ($user->role_id === 1) {
            return response()->json([
                'success' => false,
                'message' => 'Admin accounts cannot be deleted.',
            ], 403);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Delete the user
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully.',
        ], 200)
        ->withoutCookie('token')
        ->withoutCookie('user');
    }
}
