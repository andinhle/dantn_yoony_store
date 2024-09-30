<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;


class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest('id')->paginate(3);

        return BlogResource::collection($blogs);
    }

    public function store(StoreBlogRequest $request)
    {
        $blog = Blog::create($request->validated());

        return response()->json([
            'message' => 'Blog đã được thêm thành công!',
            'blog' => new BlogResource($blog)
        ], 201);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return new BlogResource($blog);
    }

    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $data = [
            'content' => $request->content,
            'slug' => $request->slug,
            'user_id' => $request->user_id,
            'is_active' => $request->has('is_active') ? $request->is_active : $blog->is_active,
        ];

        $blog->update($data);

        return response()->json([
            'message' => 'Blog đã được sửa thành công!',
            'blog' => new BlogResource($blog)
        ], 200);
    }


    public function updateIsActive(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $blog->update(['is_active' => $request->validated()['is_active']]);

        return response()->json([
            'message' => 'Banner trạng thái đã được cập nhật thành công!',
            'blog' => new BlogResource($blog)
        ], 200);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json([
            'message' => 'Blog đã được xóa thành công!',
        ], 200);
    }
}
