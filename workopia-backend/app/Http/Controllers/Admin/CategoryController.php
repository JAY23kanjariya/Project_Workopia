<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // 🔹 Get All Categories (Anyone logged in)
    public function index(Request $request){

        // Fetch all categories without pagination if 'all=true'
        if ($request->has('all') && $request->all == 'true') {
            $categories = Category::latest()->get();
        } else {
            // Fetch all categories with pagination (10 per page)
            $categories = Category::latest()->paginate(10);
        }

        // Return response
        return response()->json([
            'success' => true,
            'categories' => $categories
        ], 200);
    }

    // 🔹 Create New Category (Admin only)
    public function store(Request $request){

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
        ]);

        // send validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Create new category
        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'status' => $request->status,
        ]);

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'category' => $category
        ], 200);
    }

    // 🔹 Get Single Category (Anyone logged in)
    public function show($id){
        // Find category by ID
        $category = Category::find($id);

        // If category not found, return error
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.'  
            ], 404);
        }

        // Return response
        return response()->json([
            'success' => true,
            'category' => $category
        ], 200);
    }

    // 🔹 Update Existing Category (Admin only)
    public function update(Request $request, $id){
        // Find category by ID
        $category = Category::find($id);

        // If category not found, return error
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.'  
            ], 404);
        }

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|boolean',
        ]);

        // send validation errors
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Update category fields if provided
        $category->update($request->only(['name', 'description', 'status']));
       

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'category' => $category
        ], 200);
    }

    // 🔹 Delete Category (Admin only)
    public function destroy($id){
        // Find category by ID
        $category = Category::find($id);

        // If category not found, return error
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found.'  
            ], 404);
        }

        // Delete category
        $category->delete();

        // Return response
        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.'
        ], 200);
    }
}
