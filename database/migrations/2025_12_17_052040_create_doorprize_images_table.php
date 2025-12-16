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
    Schema::create('doorprize_images', function (Blueprint $table) {
      $table->id();
      $table->uuid('doorprize_id');
      $table->foreign('doorprize_id')->references('id')->on('doorprizes')->onDelete('cascade');
      $table->string('image_path');
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
    Schema::dropIfExists('doorprize_images');
  }
};
