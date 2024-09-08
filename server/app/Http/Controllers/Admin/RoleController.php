<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Role;
use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Http\Resources\Roles\RoleResource;
// use App\Http\Resources\Roles\RoleCollection;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::paginate(10);
        return RoleResource::collection($roles);

        // return response()->json([
        //     'message' => 'Lấy danh sách role thành công!',
        //     'data' => new RoleCollection($roles)
        // ], 200); // 200 OK
    }

    public function store(StoreRoleRequest $request)
    {
        $role = Role::create($request->validated());
        return response()->json([
            'message' => 'Thêm role thành công!',
            'data' => new RoleResource($role)
        ], 201);
    }

    public function show($id)
    {
        $role = Role::findOrFail($id);
        return new RoleResource($role);
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->validated());
        return response()->json([
            'message' => 'Cập nhật role thành công!',
            'data' => new RoleResource($role)
        ], 200);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();
        return response()->json([
            'message' => 'Xóa role thành công!'
        ], 200);
    }
}
