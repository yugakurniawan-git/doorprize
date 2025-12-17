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
    Schema::create('winners', function (Blueprint $table) {
      $table->uuid('id')->primary();
      $table->uuid('doorprize_id');
      $table->foreign('doorprize_id')->references('id')->on('doorprizes')->onDelete('cascade');
      $table->string('code')->unique();
      $table->string('name')->nullable();
      $table->string('email')->nullable();
      $table->string('phone')->nullable();
      $table->text('address')->nullable();
      $table->timestamp('claimed_at')->nullable();
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
    Schema::dropIfExists('winners');
  }
};
