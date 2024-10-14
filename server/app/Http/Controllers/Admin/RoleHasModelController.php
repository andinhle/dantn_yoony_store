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
            'role_id' => 'required|exists:roles,id|unique:role_has_models,role_id',
            'model_id' => 'required|array',
            'model_id.*' => 'integer|exists:models,id',
        ]);

        try {
            // Gán các model cho role
            foreach ($validatedData['model_id'] as $modelId) {
                RoleHasModel::create([
                    'role_id' => $validatedData['role_id'],
                    'model_id' => $modelId
                ]);
            }

            // Lấy role và các model đã gán cho role
            $roleWithModels = Role::with(['roleHasModels.modelName'])
                ->where('id', $validatedData['role_id'])
                ->first();

            // Chuyển đổi thành dạng mong muốn
            $response = [
                'id' => $roleWithModels->id,
                'role' => [
                    'id' => $roleWithModels->id,
                    'name' => $roleWithModels->name,
                    'created_at' => $roleWithModels->created_at,
                    'updated_at' => $roleWithModels->updated_at,
                    'models' => $roleWithModels->roleHasModels->map(function ($roleHasModel) {
                        return [
                            'id' => $roleHasModel->modelName->id,
                            'name' => $roleHasModel->modelName->name,
                            'type' => $roleHasModel->modelName->type,
                            'created_at' => $roleHasModel->modelName->created_at,
                            'updated_at' => $roleHasModel->modelName->updated_at,
                        ];
                    }),
                ],
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Models đã được gán cho vai trò',
                'data' => $response,
            ], 201);
        } catch (\Throwable $th) {
            Log::error($th->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Lỗi khi gán model cho vai trò',
                'error_details' => $th->getMessage()
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


    //get all model theo role
    public function getAllByRole()
    {
        $rolesWithModels = Role::with(['roleHasModels.modelName'])->get();
    
        $response = $rolesWithModels->map(function ($role) {
            return [
                'id' => $role->id,
                'role' => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'created_at' => $role->created_at,
                    'updated_at' => $role->updated_at,
                    'models' => $role->roleHasModels->map(function ($roleHasModel) {
                        return [
                            'id' => $roleHasModel->modelName->id,
                            'name' => $roleHasModel->modelName->name,
                            'type' => $roleHasModel->modelName->type,
                            'created_at' => $roleHasModel->modelName->created_at,
                            'updated_at' => $roleHasModel->modelName->updated_at,
                        ];
                    }),
                ],
            ];
        });
    
        return response()->json([
            'status' => 'success',
            'data' => $response,
        ], 200);
    }
    

}
