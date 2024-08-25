<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $request->validated($request->only(['email', 'password']));

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return $this->error([], 'Tài khoản hoặc mật khẩu không chính xác', 401);
            }

            $user = User::where('email', $request->email)->first();

            // Xóa các token của tài khoản trước đó
            $user->tokens()->delete();

            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'user' => $user,
                'token' => $user->createToken('API Token')->plainTextToken
            ], 200); 

        } catch (\Exception $e) {
            Log::error('Có lỗi xảy ra: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đăng nhập.'
            ], 500);
        }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $request->validated($request->all());
            
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            
            return response()->json([
                'message' => 'Đăng ký thành công!',
                'user' => $user,
                'token' => $user->createToken('API Token')->plainTextToken
            ], 200); 
        } catch (\Exception $e) {
            Log::error('Có lỗi xảy ra: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đăng ký.'
            ], 500);
        }
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng Xuất thành công!'
        ], 200);
    }
}
