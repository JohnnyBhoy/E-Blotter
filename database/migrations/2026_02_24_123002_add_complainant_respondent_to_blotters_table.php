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
            // Add foreign key columns after removing old columns
            $table->unsignedBigInteger('complainant_id')->nullable()->after('user_id');
            $table->unsignedBigInteger('respondent_id')->nullable()->after('complainant_id');
            
            // Drop old columns if they exist
            if (Schema::hasColumn('blotters', 'complainant_signature')) {
                $table->dropColumn('complainant_signature');
            }
            if (Schema::hasColumn('blotters', 'recorded_by')) {
                $table->dropColumn('recorded_by');
            }
            
            // Add foreign key constraints
            $table->foreign('complainant_id')->references('id')->on('complainants')->onDelete('set null');
            $table->foreign('respondent_id')->references('id')->on('respondents')->onDelete('set null');
        });
    }

    /**
     * Replace the migrations.
     */
    public function down(): void
    {
        Schema::table('blotters', function (Blueprint $table) {
            // Reverse the changes
            $table->dropForeign(['complainant_id', 'respondent_id']);
            
            // Restore old columns
            $table->string('complainant_signature')->nullable()->after('user_id');
            $table->string('recorded_by')->nullable()->after('complainant_signature');
        });
    }
};
