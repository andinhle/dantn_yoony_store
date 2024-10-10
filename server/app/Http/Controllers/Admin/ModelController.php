<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModelName;
use Illuminate\Support\Facades\File;
use Spatie\ModelInfo\ModelFinder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class ModelController extends Controller
{

    //lấy all model path
    public function getModels()
    {
        $models = ModelFinder::all();
    
        return response()->json([
            'status' => 'success',
            'data' => $models,
        ]);
    }
    

    // Lấy danh sách tất cả các model
    public function index()
    {
        try {
            $models = ModelName::all();
    
            // Giải mã trường 'type' cho mỗi model
            $models->transform(function ($model) {
                $model->type = json_decode($model->type, true); 
                return $model;
            });
    
            return response()->json([
                'status' => 'success',
                'data' => $models 
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tải danh sách models'
            ], 500);
        }
    }
    

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255|unique:models,name',
            'type' => 'required|string',
            'type.*' => 'string|max:255',
        ]);
    
        try {
            // Tạo một model mới
            $model = ModelName::create([
                'name' => $validatedData['name'],
                'type' => $validatedData['type']
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Model đã được tạo',
                'data' => $model
            ], 201);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi tạo model'
            ], 500);
        }
    }
    

      // Xóa một model
    public function destroy($id)
    {
        try {
            $model = ModelName::findOrFail($id);
            $model->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Model đã được xóa'
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa model'
            ], 500);
        }
    }




}
