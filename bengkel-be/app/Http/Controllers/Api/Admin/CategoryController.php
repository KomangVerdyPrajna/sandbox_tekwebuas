<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories
    public function index()
    {
        return response()->json(Category::all());
    }

    // POST /api/categories
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required'
        ]);

        $category = Category::create([
            'name' => $request->name
        ]);

        return response()->json($category, 201);
    }

    // GET /api/categories/{id}
    public function show($id)
    {
        return Category::findOrFail($id);
    }

    // PUT /api/categories/{id}
    public function update(Request $request, $id)
    {
        $request->validate(['name' => 'required']);

        $cat = Category::findOrFail($id);
        $cat->update(['name' => $request->name]);

        return response()->json($cat);
    }

    // DELETE /api/categories/{id}
    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
