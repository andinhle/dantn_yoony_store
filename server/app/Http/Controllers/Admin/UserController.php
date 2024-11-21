<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Lấy tất cả thông tin user
    public function index()
    {
        $users = User::query()->paginate(5);

        return response()->json($users, 200);
    }
    public function updateRole(Request $request, $id)
    {
        try {
            // Xác thực đầu vào
            $validatedData = $request->validate([
                'role' => 'required|in:admin,user', 
            ]);

            // Tìm người dùng theo ID
            $user = User::find($id);

            if (!$user) {
                return response()->json(['message' => 'Người dùng không tồn tại.'], 404);
            }

            // Cập nhật quyền
            $user->role = $validatedData['role'];
            $user->save();

            return response()->json([
                'message' => 'Cập nhật quyền thành công.',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra khi cập nhật quyền.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}
