<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('permissions', function (Blueprint $table) {
      $table->id();
      $table->string('name')->unique();
      $table->string('guard_name');
      $table->timestamps();
      $table->softDeletes();
      $table->unsignedBigInteger('created_by')->nullable();
      $table->unsignedBigInteger('updated_by')->nullable();
      $table->unsignedBigInteger('deleted_by')->nullable();
    });

    Schema::create('roles', function (Blueprint $table) {
      $table->id();
      $table->string('name')->unique();
      $table->string('guard_name');
      $table->timestamps();
      $table->softDeletes();
      $table->unsignedBigInteger('created_by')->nullable();
      $table->unsignedBigInteger('updated_by')->nullable();
      $table->unsignedBigInteger('deleted_by')->nullable();
    });

    Schema::create('model_has_permissions', function (Blueprint $table) {
      $table->unsignedBigInteger('permission_id');
      $table->unsignedBigInteger('model_id');
      $table->string('model_type');
      $table->index(['model_id', 'model_type'], 'model_has_permissions_model_id_model_type_index');
      $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
    });

    Schema::create('model_has_roles', function (Blueprint $table) {
      $table->unsignedBigInteger('role_id');
      $table->unsignedBigInteger('model_id');
      $table->string('model_type');
      $table->index(['model_id', 'model_type'], 'model_has_roles_model_id_model_type_index');
      $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
    });

    Schema::create('role_has_permissions', function (Blueprint $table) {
      $table->unsignedBigInteger('permission_id');
      $table->unsignedBigInteger('role_id');
      $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
      $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('permissions');
    Schema::dropIfExists('roles');
    Schema::dropIfExists('model_has_permissions');
    Schema::dropIfExists('model_has_roles');
    Schema::dropIfExists('role_has_permissions');
  }
};
