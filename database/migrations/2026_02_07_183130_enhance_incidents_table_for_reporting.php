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
        Schema::table('incidents', function (Blueprint $table) {
            $table->string('report_category')->after('incident_type')->nullable(); // crime, fire, accident, general
            $table->string('agency_assigned')->after('victim_details')->nullable(); // PNP, BFP, EMS, etc.
            $table->string('severity_level')->after('agency_assigned')->nullable(); // low, medium, high, critical
            $table->string('status')->default('pending')->after('severity_level'); // pending, investigating, resolved
            $table->text('additional_data')->after('status')->nullable(); // JSON for extra fields
            $table->boolean('is_emergency')->default(false)->after('additional_data');
            $table->timestamp('responded_at')->nullable()->after('is_emergency');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incidents', function (Blueprint $table) {
            $table->dropColumn([
                'report_category',
                'agency_assigned', 
                'severity_level',
                'status',
                'additional_data',
                'is_emergency',
                'responded_at'
            ]);
        });
    }
};
