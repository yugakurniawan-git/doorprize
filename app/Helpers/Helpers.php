<?php

use App\Models\Account\ModelHasRole;
use App\Models\Account\Permission;
use App\Models\Account\Role;
use App\Models\Account\RoleHasPermission;
use App\Models\Account\User;
use Illuminate\Support\Facades\Auth;

if (!function_exists('hasRole')) {
  function hasRole($role)
  {
    $roles = is_array($role) ? $role : explode('|', $role);
    $user = User::where('id', Auth::id())->first();
    return $user->hasRole($roles);
  }
}

if (!function_exists('can')) {
  function can($permission)
  {
    $permissions = is_array($permission) ? $permission : explode('|', $permission);
    $user = User::where('id', Auth::id())->first();
    return $user->hasPermission($permissions);
  }
}

if (!function_exists('createRoleWithPermissions')) {
  function createRoleWithPermissions(string $roleName, array $permissions)
  {
    $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'api']);
    RoleHasPermission::where('role_id', $role->id)->delete(); // Clear existing permissions
    $data_role_permissions = [];
    foreach ($permissions as $permissionName) {
      $permission = Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'api']);
      $data_role_permissions[] = ['role_id' => $role->id, 'permission_id' => $permission->id];
    }
    RoleHasPermission::insert(array_unique($data_role_permissions, SORT_REGULAR)); // Insert new permissions
    return $role;
  }
}

if (!function_exists('syncUserToNewRole')) {
  function syncUserToNewRole($old_role, $id_new_role)
  {
    $users = User::whereHas('roles', fn($q) => $q->whereName($old_role))->get();
    $users->each(function ($user) use ($id_new_role) {
      $existing = ModelHasRole::where([
        'model_type' => User::class,
        'model_id' => $user->id,
        'role_id' => $id_new_role
      ])->first();

      if (!$existing) {
        ModelHasRole::create([
          'model_type' => User::class,
          'model_id' => $user->id,
          'role_id' => $id_new_role,
          'is_active' => 1
        ]);
      }
    });
  }
}
