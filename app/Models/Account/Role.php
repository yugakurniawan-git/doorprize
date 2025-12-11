<?php

namespace App\Models\Account;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
  use BaseModel;

  protected $table    = 'roles';
  protected $fillable = [
    'name',
    'guard_name',
  ];

  public function model_has_roles()
  {
    return $this->hasMany(ModelHasRole::class, 'role_id', 'id');
  }

  public function role_has_permissions()
  {
    return $this->hasMany(RoleHasPermission::class, 'role_id', 'id');
  }

  public function permissions()
  {
    return $this->belongsToMany(Permission::class, 'role_has_permissions', 'role_id', 'permission_id');
  }
}
