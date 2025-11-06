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
        return Socialite::driver('google')
            ->with(['access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect();
    }


    // Xử lý callback từ Google
  public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'provider_token' => $googleUser->token,
                    'provider_refresh_token' => $googleUser->refreshToken ?? null,
                    'avatar' => $googleUser->getAvatar(),
                ]
            );

            Auth::login($user);

            $token = $user->createToken('GoogleLoginToken')->plainTextToken;

            // Redirect về React kèm token
            return redirect()->away('http://localhost:5173/login/success?token=' . $token);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đăng nhập Google thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }





    public function redirectToFacebook()
{
    $url = Socialite::driver('facebook')->stateless()->redirect()->getTargetUrl();

    return response()->json(['url' => $url]);
}

public function handleFacebookCallback()
{
    try {

        $SocialUser = Socialite::driver('facebook')->stateless()->user();

        $user = User::updateOrCreate(
            [
                'provider_id' => $SocialUser->id,
                'provider' => 'facebook'
            ],
            [
                'name' => $SocialUser->name,
                'email' => $SocialUser->email,
                'provider_token' => $SocialUser->token,
                'avatar' => $SocialUser->avatar,
                'password' => null,
            ]
        );

        Auth::login($user);

        $token = $user->createToken('SocialLoginToken')->plainTextToken;


        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    } catch (\Exception $e) {

        return response()->json([
            'message' => 'Đăng nhập thất bại',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
