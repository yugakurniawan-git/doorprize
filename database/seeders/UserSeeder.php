<?php

namespace Database\Seeders;

use App\Models\Account\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    User::firstOrCreate([
      'name'              => 'Super Admin',
      'email'             => 'super.admin@manohara-asri.com',
      'username'          => 'super.admin',
      'password'          => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      'email_verified_at' => now(),
      'created_at'        => now(),
      'updated_at'        => now(),
    ])->assignRole('Super Admin');

    User::firstOrCreate([
      'name'              => 'Admin',
      'email'             => 'admin@manohara-asri.com',
      'username'          => 'admin',
      'password'          => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      'email_verified_at' => now(),
      'created_at'        => now(),
      'updated_at'        => now(),
    ])->assignRole('Admin');
  }
}
