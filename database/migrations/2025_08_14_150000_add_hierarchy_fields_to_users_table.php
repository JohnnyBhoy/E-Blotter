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
        Schema::table('users', function (Blueprint $table) {
            // Parent relationship fields
            $table->unsignedBigInteger('province_id')->nullable()->after('role');
            $table->unsignedBigInteger('municipality_id')->nullable()->after('province_id');
            $table->unsignedBigInteger('station_id')->nullable()->after('municipality_id');
            
            // Foreign key constraints
            $table->foreign('province_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('municipality_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('station_id')->references('id')->on('users')->onDelete('set null');
            
            // Indexes for performance
            $table->index('province_id');
            $table->index('municipality_id');
            $table->index('station_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['province_id']);
            $table->dropForeign(['municipality_id']);
            $table->dropForeign(['station_id']);
            $table->dropIndex(['province_id']);
            $table->dropIndex(['municipality_id']);
            $table->dropIndex(['station_id']);
            $table->dropColumn(['province_id', 'municipality_id', 'station_id']);
        });
    }
};
