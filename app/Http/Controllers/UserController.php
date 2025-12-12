<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account\User;
use Dedoc\Scramble\Attributes\QueryParameter;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   * @response array{"current_page": int, "data": object[], "first_page_url": "string", "from": int, "last_page": int, "last_page_url": "string", "links": object[], "next_page_url": "string", "path": "string", "per_page": int, "prev_page_url": "string", "to": int, "total": int}
   */
  #[QueryParameter('q', type: 'string', format: 'text', description: 'Search query')]
  #[QueryParameter('include', type: 'array<string>', format: 'csv', example: '["roles:id,name"]', description: '<p style="margin-bottom:0">Relationships to include:</p>
    <ul style="margin-top:0px;">
      <li>creator</li>
      <li>updater</li>
      <li>deleter</li>
    </ul>
  ')]
  #[QueryParameter('joins', type: 'array<string>', format: 'csv', example: '["table,on1,condition,on2,type"]', description: 'Relationships to join')]
  #[QueryParameter('fields', type: 'array<string>', format: 'csv', example: '["id","name","created_at"]', description: 'Columns to select similar to SQL queries')]
  #[QueryParameter('sort_by', type: 'string', format: 'text', description: 'Column to sort by.<br>
    if want to sort from "joins" use dot notation (e.g. roles.name).<br>
    if want to sort from "include" use arrow notation (e.g. roles->name)
  ')]
  #[QueryParameter('sort_type', type: 'string', format: 'text', description: 'Sort order (asc or desc)')]
  #[QueryParameter('per_page', type: 'integer', format: 'int32', description: 'Number of items per page')]
  #[QueryParameter('page', type: 'integer', format: 'int32', description: 'Page number')]
  #[QueryParameter('filters', type: 'object', format: 'json', example: '{"name":"test"}', description: 'Column filters as key-value pairs if want to filters on "include" or "joins" use arrow notation (e.g. profile->address->city)')]
  #[QueryParameter('wheres', type: 'array<string>', format: 'csv', example: '["column,operator,value"]' , description: 'Where conditions as array of strings')]
  public function index()
  {
    return User::list();
  }

  /**
   * Store a newly created resource or update an existing resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $data = $request->validate([
      'id'            => 'nullable|string',
      'name'          => 'required|string|max:100',
      'email'         => 'required|string|email|max:100|unique:users,email,' . $request->id,
      'username'      => 'required|string|max:50|unique:users,username,' . $request->id,
      'roles'         => 'sometimes|array',
      'roles.*'       => 'string|exists:roles,name',
      'permissions'   => 'sometimes|array',
      'permissions.*' => 'string|exists:permissions,name',
      'avatar'        => 'sometimes|file|image|max:2048',
      'remove_avatar' => 'sometimes|boolean',
    ], [], [
      'name'          => 'Name',
      'email'         => 'Email',
      'username'      => 'Username',
      'roles'         => 'Roles',
      'permissions'   => 'Permissions',
      'avatar'        => 'Avatar',
      'remove_avatar' => 'Remove Avatar',
    ]);

    if (!isset($request->id)) {
      $data['password'] = bcrypt('password');
    }

    if ($request->hasFile('avatar')) {
      if ($request->id) {
        $user = User::find($request->id);
        if ($user && $user->avatar) {
          Storage::disk('public')->delete($user->avatar);
        }
      }
      $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
    } elseif (isset($data['remove_avatar']) && $data['remove_avatar']) {
      if ($request->id) {
        $user = User::find($request->id);
        if ($user && $user->avatar) {
          Storage::disk('public')->delete($user->avatar);
        }
      }
      $data['avatar'] = null;
    }

    $user = User::updateOrCreate(['id' => $request->id], $data);
    $user->roles()->detach();
    if (isset($data['roles'])) {
      foreach ($data['roles'] as $roleName) {
        $user->assignRole($roleName);
      }
    }

    $user->special_permissions()->detach();
    if (isset($data['permissions'])) {
      foreach ($data['permissions'] as $permissionName) {
        $user->assignPermission($permissionName);
      }
    }

    return $user->load('roles:id,name', 'special_permissions:id,name');
  }

  /**
   * Display the specified resource.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  User  $user
   * @return \Illuminate\Http\Response
   */
  #[QueryParameter('include', type: 'array<string>', format: 'csv', description: 'Relationships to include', example: '["roles:id,name"]')]
  public function show(Request $request, User $user)
  {
    if ($request->has('include') && is_array($request->query('include'))) {
      $user->load($request->query('include'));
    }
    return $user;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  User  $user
   * @return \Illuminate\Http\Response
   */
  public function destroy(User $user)
  {
    $user->delete();
    return ['message' => 'User deleted successfully.'];
  }
}
