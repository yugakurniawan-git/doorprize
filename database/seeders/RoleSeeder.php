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
  }

  private function roleSuperAdmin()
  {
    createRoleWithPermissions('Super Admin', [
      'view list users',
      'create user',
      'edit user',
      'delete user',

      'view list roles',
      'create role',
      'edit role',
      'delete role',

      'view list permissions',
      'create permission',
      'edit permission',
      'delete permission',
    ]);
  }
}
