<?php

namespace App\Http\Resources;

use App\Http\Resources\Roles\RoleResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoleHasModelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, // Nếu bạn có cột id trong bảng role_has_models
            'role' => new RoleResource($this->role), // Sử dụng Resource cho Role
            'model' => new ModelNameResource($this->modelName), // Sử dụng Resource cho ModelName
        ];
    }
}
