<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Doorprize\Winner;

return new class extends Migration {

  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::table('winners', function (Blueprint $table) {
      $table->tinyInteger('status')->default(0)->after('address')->comment('0: pending, 1: claimed, 2: onprocess, 3: shipped, 4: delivered, 5: cancelled');
      $table->text('notes')->nullable()->after('status');
    });

    Winner::whereNotNull('claimed_at')->update(['status' => 1]);
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('winners', function (Blueprint $table) {
      $table->dropColumn('status', 'notes');
    });
  }
};
