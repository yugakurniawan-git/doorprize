<?php

namespace App\Models\Account;

use App\Models\BaseModel;

class Permission extends BaseModel
{
  protected $table = 'permissions';

  protected $fillable = [
    'name',
    'guard_name',
  ];

  public function roles()
  {
    return $this->belongsToMany(Role::class, 'role_has_permissions', 'permission_id', 'role_id');
  }

  public function users()
  {
    return $this->belongsToMany(User::class, 'model_has_permissions', 'permission_id', 'user_id');
  }
}
