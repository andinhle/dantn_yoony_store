<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleAndModelResource;
use App\Models\ModelName;
use App\Models\Role;
use App\Models\RoleHasModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleHasModelController extends Controller
{

    public function index()
    {
        try {
            $roles = Role::all();
            $models = ModelName::all();
    
            $data = [
                'roles' => $roles,
                'models' => $models, 
            ];
    
            return response()->json($data, 200);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi truy xuất dữ liệu'
            ], 500);
        }
    }
    
    
    // Gán model cho vai trò
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'role_id' => 'required|exists:roles,id', 
            'model_id' => 'required|array', 
            'model_id.*' => 'integer|exists:models,id', 
        ]);
    
        try {
            foreach ($validatedData['model_id'] as $modelId) {
                RoleHasModel::create([
                    'role_id' => $validatedData['role_id'],
                    'model_id' => $modelId
                ]);
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Models đã được gán cho vai trò',
                'data' => $validatedData['model_id']
            ], 201);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi gán model cho vai trò'
            ], 500);
        }
    }
    
    // Xóa phân quyền model khỏi vai trò
    public function destroy($roleId, $modelId)
    {
        try {
            $roleHasModel = RoleHasModel::where('role_id', $roleId)
                ->where('model_id', $modelId)
                ->firstOrFail();

            $roleHasModel->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Phân quyền model đã được xóa khỏi vai trò'
            ]);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi xóa phân quyền model'
            ], 500);
        }
    }
}
