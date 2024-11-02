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
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }


    // Xử lý callback từ Google
    public function handleGoogleCallback()
    {
        try {
            // Lấy thông tin người dùng từ Google
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Tìm hoặc tạo người dùng
            $user = User::firstOrCreate(
                ['provider_id' => $googleUser->getId()],
                [
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => null, // không cần mật khẩu cho OAuth
                ]
            );

            // Đăng nhập người dùng
            Auth::login($user);

            // Tạo token cho người dùng
            $token = $user->createToken('GoogleLoginToken')->plainTextToken;

            // Trả về JSON chứa token và thông tin người dùng
            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            // Xử lý lỗi khi không thể lấy thông tin người dùng
            return response()->json([
                'message' => 'Đăng nhập Google thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
