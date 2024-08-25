<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\InsertCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{

    public function index()
    {
        $category = Category::orderByDesc('id')->get();

        return CategoryResource::collection($category)->additional(['message' => 'Toàn Bộ Danh Mục']);
    }

    public function store(InsertCategoryRequest $request)
    {
        if ($request->hasFile('image')) {
            $fileName = $request->file('image')->store('uploads/category', 'public');
        } else {
            $fileName = null;
        }

        $data = [
            'name' => $request->name,
            'slug' => $request->slug,
            'image' => $fileName,
            'is_active' => $request->is_active,
        ];

        $category = Category::create($data);

        return (new CategoryResource($category))->additional(['message' => 'Thêm danh mục thành công!']);
    }

    public function show(string $id)
    {
        $category = Category::findOrFail($id);

        return (new CategoryResource($category))->additional(['message' => 'Hiển thị dữ liệu thành công!']);
    }


    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $id,
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'boolean',
        ]);

        $category = Category::findOrFail($id);
        if ($request->hasFile('image')) {
            //nếu có ảnh cũ thì xóa
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $fileName = $request->file('image')->store('uploads/category', 'public');
        } else {
            $fileName = $category->image;
        }

        $data = [
            'name' => $request->name,
            'slug' => $request->slug,
            'image' => $fileName,
            'is_active' => $request->has('is_active') ? $request->is_active : $category->is_active,
        ];

        $category->update($data);

        return (new CategoryResource($category))->additional(['message' => 'Sửa danh mục thành công!']);
    }

    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();
        return response()->json(['message' => 'Xóa danh mục thành công!'], 200);
    }

    public function updateIsActive(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $category->update([
            'is_active' => $request->is_active,
        ]);
        return response()->json([
            'message' => 'Cập nhật trạng thái hoạt động thành công!',
            'data' => new CategoryResource($category),
        ], 200);
    }
}
