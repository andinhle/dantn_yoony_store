<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Banners\StoreBannerRequest;
use App\Http\Requests\Banners\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::latest('id')->paginate(5);
        return BannerResource::collection($banners);
    }

    public function store(StoreBannerRequest $request)
    {
        $banner = Banner::create($request->validated());

        return response()->json([
            'message' => 'Banner đã được thêm thành công!',
            'banner' => new BannerResource($banner)
        ], 201);
    }

    public function show($id)
    {
        $banner = Banner::findOrFail($id);

        return new BannerResource($banner);
    }

    public function update(UpdateBannerRequest $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $banner->update($request->validated());

        return response()->json([
            'message' => 'Banner đã được sửa thành công!',
            'banner' => new BannerResource($banner)
        ], 200);
    }
    public function updateIsActive(UpdateBannerRequest $request, $id)
    {
        $blog = Banner::findOrFail($id);

        $blog->update(['is_active' => $request->validated()['is_active']]);

        return response()->json([
            'message' => 'Banner trạng thái đã được cập nhật thành công!',
            'blog' => new BannerResource($blog)
        ], 200);
    }
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        $banner->delete();

        return response()->json([
            'message' => 'Banner đã được xóa thành công!',
        ], 200);
    }
}
