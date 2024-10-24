<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DynamicPermissionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $userModelTypes = $user->role->modelTypes()->pluck('type')->toArray();
            
            // Làm sạch dữ liệu
            $userModelTypes = array_map('trim', $userModelTypes);
            
            // Log::info('User model types after cleaning', ['types' => $userModelTypes]);

            // Kiểm tra quyền admin
            if (in_array('admin', $userModelTypes)) {
                return $next($request);
            }

            // Tiếp tục với logic kiểm tra quyền cho các route khác
            $route = $request->route();
            $controller = $route->getController();
            $controllerClass = get_class($controller);
            $modelName = $this->getModelNameFromController($controllerClass);
            
            if ($this->userHasPermission($userModelTypes, $modelName)) {
                return $next($request);
            }
            
            return response()->json(['message' => 'Unauthorized. You do not have the required permissions.'], 403);

        } catch (\Exception $e) {
            Log::error('Error in DynamicPermissionMiddleware', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            return response()->json(['message' => 'An error occurred'], 500);
        }
    }

    private function getModelNameFromController($controllerClass)
    {
        $parts = explode('\\', $controllerClass);
        $controllerName = end($parts);
        return "App\\Models\\" . str_replace('Controller', '', $controllerName);
    }

    private function userHasPermission($userModelTypes, $modelName)
    {
        return in_array($modelName, $userModelTypes);
    }
}