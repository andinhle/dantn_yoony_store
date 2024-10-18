<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    // public function handle(Request $request, Closure $next)
    // {
    //     $user = Auth::user();
        
    //     if ($user) {
    //         $modelType = $user->role->modelTypes()->first();
            
    //         if ($modelType->type = "admin") {
    //             return $next($request);
    //         }
    //     }
        
    //     return response()->json(['message' => 'Yêu cầu quyền truy cập của quản trị viên.'], 403);
    // }
}