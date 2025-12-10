<?php

namespace App\Models\Account;

use App\Models\BaseModel;

class RoleHasPermission extends BaseModel
{
  protected $table = 'role_has_permissions';
  public $timestamps = false;
  protected $fillable = [
    'permission_id',
    'role_id',
  ];

  public function permission()
  {
    return $this->belongsTo(Permission::class, 'permission_id', 'id');
  }

  public function role()
  {
    return $this->belongsTo(Role::class, 'role_id', 'id');
  }
}
