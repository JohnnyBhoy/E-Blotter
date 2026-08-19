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
        // Some environments already had these columns added by hand before the
        // migration existed, so each one is added only when it is missing.
        Schema::table('blotters', function (Blueprint $table) {
            foreach (['date_of_incident', 'time_of_incident', 'uploaded_file'] as $column) {
                if (! Schema::hasColumn('blotters', $column)) {
                    $table->string($column)->nullable();
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blotters', function (Blueprint $table) {
            $table->dropColumn(['date_of_incident', 'time_of_incident', 'uploaded_file']);
        });
    }
};
