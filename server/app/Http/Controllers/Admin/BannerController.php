<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\banner\StoreBannerRequest;
use App\Http\Requests\banner\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::all();

        return BannerResource::collection($banners);
    }

    public function store(StoreBannerRequest $request)
    {
        $banner = Banner::create($request->validated());

        return response()->json([
            'message' => 'Banner created successfully!',
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
            'message' => 'Banner updated successfully!',
            'banner' => new BannerResource($banner)
        ], 200);
    }

    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        $banner->delete();

        return response()->json([
            'message' => 'Banner deleted successfully!',
        ], 204);
    }
}
