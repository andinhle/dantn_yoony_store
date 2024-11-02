<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class GoogleAuthController extends Controller
{
    // Điều hướng đến Google để đăng nhập
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    // Xử lý callback từ Google
    public function handleGoogleCallback(Request $request)
    {
        try {
            // Lấy mã token từ yêu cầu
            $token = $request->input('token');

            // Xác thực người dùng từ mã token
            $googleUser = Socialite::driver('google')->stateless()->userFromToken($token);

            // Tìm hoặc tạo người dùng
            $user = User::firstOrCreate(
                ['provider_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => null, 
                ]
            );

            // Đăng nhập người dùng và tạo token
            Auth::login($user);
            $token = $user->createToken('GoogleLoginToken')->plainTextToken;

            // Trả về JSON chứa token và thông tin người dùng
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đăng nhập Google thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
