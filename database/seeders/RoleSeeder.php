<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $this->roleSuperAdmin();
    $this->roleAdmin();
  }

  private function roleSuperAdmin()
  {
    createRoleWithPermissions('Super Admin', [
      'view list users',
      'create user',
      'view user',
      'edit user',
      'delete user',

      'view list roles',
      'create role',
      'view role',
      'edit role',
      'delete role',

      'view list permissions',
      'create permission',
      'view permission',
      'edit permission',
      'delete permission',
    ]);
  }

  private function roleAdmin()
  {
    createRoleWithPermissions('Admin', [
      'view list users',
      'create user',
      'view user',
      'edit user',
      'delete user',
    ]);
  }
}
