<?php

namespace App\Models\Account;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
  use LogsActivity, HasFactory, Notifiable;

  protected $table = 'users';

  public function getActivitylogOptions(): LogOptions
  {
    return LogOptions::defaults()
      ->logAll()
      ->useLogName('Account')
      ->setDescriptionForEvent(fn(string $eventName) => "User has been $eventName")
      ->logOnlyDirty();
  }

  /**
   * The attributes that are mass assignable.
   *
   * @var array<int, string>
   */
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

  public function assignRole($roleName)
  {
    $role = Role::where('name', $roleName)->first();
    if ($role) {
      $this->roles()->attach($role->id, ['model_type' => self::class]);
    }
  }

  public function special_permissions()
  {
    return $this->belongsToMany(Permission::class, 'model_has_permissions', 'model_id', 'permission_id')
                ->where('model_type', self::class);
  }
}
