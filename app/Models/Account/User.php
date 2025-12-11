<?php

namespace App\Models\Account;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
  use BaseModel, CustomSoftDeletes, HasFactory, Notifiable;

  protected $table      = 'users';
  public $incrementing  = false;
  protected $keyType    = 'string';
  protected $fillable = [
    'id',
    'name',
    'username',
    'avatar',
    'email',
    'email_verified_at',
    'password',
    'remember_token',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var array<int, string>
   */
  protected $hidden = [
    'password',
    'remember_token',
    'roles',
    'permissions',
  ];

  /**
   * The attributes that should be cast.
   *
   * @var array<string, string>
   */
  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  /**
   * Get the identifier that will be stored in the subject claim of the JWT.
   *
   * @return mixed
   */
  public function getJWTIdentifier()
  {
    return $this->getKey();
  }

  /**
   * Return a key value array, containing any custom claims to be added to the JWT.
   *
   * @return array
   */
  public function getJWTCustomClaims()
  {
    return [
      'guard' => 'api',
      'user'  => [
        'id'        => $this->id,
        'name'      => $this->name,
        'username'  => $this->username,
        'email'     => $this->email,
      ]
    ];
  }

  public function roles()
  {
    return $this->belongsToMany(Role::class, 'model_has_roles', 'model_id', 'role_id')
                ->where('model_type', self::class);
  }

  public function getAllPermissions()
  {
    $permissions = collect();
    foreach ($this->roles as $role) {
      $permissions = $permissions->merge($role->permissions);
    }
    $permissions = $permissions->merge($this->special_permissions);
    return $permissions->unique('id');
  }

  public function hasRole($role)
  {
    $roles = is_array($role) ? $role : explode('|', $role);
    return $this->roles->whereIn('name', $roles)->count() > 0;
  }

  public function hasPermission($permission)
  {
    $permissions = is_array($permission) ? $permission : explode('|', $permission);
    foreach ($this->roles as $role) {
      if ($role->permissions->whereIn('name', $permissions)->count() > 0) {
        return true;
      }
    }
    foreach ($this->special_permissions as $perm) {
      if (in_array($perm->name, $permissions)) {
        return true;
      }
    }
    return false;
  }

  public function assignRole($roleNames)
  {
    $roles = is_array($roleNames) ? $roleNames : explode('|', $roleNames);

    foreach ($roles as $roleName) {
      $roleName = trim($roleName);
      $role = Role::where('name', $roleName)->first();
      if ($role && !$this->roles()->where('role_id', $role->id)->exists()) {
        $this->roles()->attach($role->id, ['model_type' => self::class]);
      }
    }
  }

  public function assignPermission($permissionNames)
  {
    $permissions = is_array($permissionNames) ? $permissionNames : explode('|', $permissionNames);

    foreach ($permissions as $permissionName) {
      $permissionName = trim($permissionName);
      $permission = Permission::where('name', $permissionName)->first();
      if ($permission && !$this->special_permissions()->where('permission_id', $permission->id)->exists()) {
        $this->special_permissions()->attach($permission->id, ['model_type' => self::class]);
      }
    }
  }

  public function special_permissions()
  {
    return $this->belongsToMany(Permission::class, 'model_has_permissions', 'model_id', 'permission_id')
                ->where('model_type', self::class);
  }
}
