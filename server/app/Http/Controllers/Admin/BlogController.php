<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\blogs\StoreBlogRequest;
use App\Http\Requests\blogs\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;

class BlogController extends Controller
{

    public function index()
    {
        $blogs = Blog::all();
        return BlogResource::collection($blogs);
    }


    public function store(StoreBlogRequest $request)
    {
        $blog = Blog::create($request->validated());

        return response()->json([
            'message' => 'Blog created successfully!',
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

        $blog->update($request->validated());

        return response()->json([
            'message' => 'cập nhập Blog thành công',
            'blog' => new BlogResource($blog)
        ], 200);
    }


    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json([
            'message' => 'Blog deleted successfully!',
        ], 204);
    }
}
