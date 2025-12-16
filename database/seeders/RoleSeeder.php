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
      // users
      'view list users',
      'create user',
      'view user',
      'edit user',
      'delete user',

      // roles
      'view list roles',
      'create role',
      'view role',
      'edit role',
      'delete role',

      // permissions
      'view list permissions',
      'create permission',
      'view permission',
      'edit permission',
      'delete permission',

      // doorprizes
      'view list doorprizes',
      'create doorprize',
      'view doorprize',
      'edit doorprize',
      'delete doorprize',

      // doorprize images
      'view list doorprize images',
      'create doorprize image',
      'view doorprize image',
      'edit doorprize image',
      'delete doorprize image',
    ]);
  }

  private function roleAdmin()
  {
    createRoleWithPermissions('Admin', [
      // users
      'view list users',
      'create user',
      'view user',
      'edit user',
      'delete user',

      // doorprizes
      'view list doorprizes',
      'create doorprize',
      'view doorprize',
      'edit doorprize',
      'delete doorprize',

      // doorprize images
      'view list doorprize images',
      'create doorprize image',
      'view doorprize image',
      'edit doorprize image',
      'delete doorprize image',
    ]);
  }
}
