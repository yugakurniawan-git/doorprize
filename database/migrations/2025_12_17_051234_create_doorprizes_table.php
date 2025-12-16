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
    Schema::create('doorprizes', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->string('name');
      $table->text('description')->nullable();
      $table->timestamps();
      $table->softDeletes();
      $table->uuid('created_by')->nullable();
      $table->uuid('updated_by')->nullable();
      $table->uuid('deleted_by')->nullable();
      $table->foreign('created_by')->nullable()->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
      $table->foreign('updated_by')->nullable()->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
      $table->foreign('deleted_by')->nullable()->references('id')->on('users')->onUpdate('cascade')->onDelete('set null');
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('doorprizes');
  }
};
