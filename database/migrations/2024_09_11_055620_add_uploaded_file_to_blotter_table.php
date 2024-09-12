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
        Schema::table('blotters', function (Blueprint $table) {
            $table->string('date_of_incident')->nullable();
            $table->string('time_of_incident')->nullable();
            $table->string('uploaded_file')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blotters', function (Blueprint $table) {
            $table->dropColumn('date_of_incident');
            $table->dropColumn('time_of_incident');
            $table->dropColumn('uploaded_file');
        });
    }
};
