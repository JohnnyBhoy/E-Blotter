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
        Schema::table('complainants', function (Blueprint $table) {
            // Change address fields from integer to string
            $table->string('complainant_barangay')->change();
            $table->string('complainant_city')->change();
            $table->string('complainant_province')->change();
            $table->string('complainant_region')->change();
            $table->string('complainant_work_barangay')->change();
            $table->string('complainant_work_city')->change();
            $table->string('complainant_work_province')->change();
            $table->string('complainant_work_region')->change();
            
            // Change demographic fields from tinyInteger to string for better readability
            $table->string('complainant_citizenship')->change();
            $table->string('complainant_gender')->change();
            $table->string('complainant_civil_status')->change();
            $table->string('complainant_occupation')->change();
            $table->string('complainant_education')->change();
        });

        Schema::table('respondents', function (Blueprint $table) {
            // Change address fields from integer to string
            $table->string('respondent_barangay')->change();
            $table->string('respondent_city')->change();
            $table->string('respondent_province')->change();
            $table->string('respondent_region')->change();
            $table->string('respondent_work_barangay')->change();
            $table->string('respondent_work_city')->change();
            $table->string('respondent_work_province')->change();
            $table->string('respondent_work_region')->change();
            
            // Change demographic fields from tinyInteger to string for better readability
            $table->string('respondent_citizenship')->change();
            $table->string('respondent_gender')->change();
            $table->string('respondent_civil_status')->change();
            $table->string('respondent_occupation')->change();
            $table->string('respondent_education')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('complainants', function (Blueprint $table) {
            // Revert address fields back to integer
            $table->integer('complainant_barangay')->change();
            $table->integer('complainant_city')->change();
            $table->integer('complainant_province')->change();
            $table->integer('complainant_region')->change();
            $table->integer('complainant_work_barangay')->change();
            $table->integer('complainant_work_city')->change();
            $table->integer('complainant_work_province')->change();
            $table->integer('complainant_work_region')->change();
            
            // Revert demographic fields back to tinyInteger
            $table->tinyInteger('complainant_citizenship')->change();
            $table->tinyInteger('complainant_gender')->change();
            $table->tinyInteger('complainant_civil_status')->change();
            $table->tinyInteger('complainant_occupation')->change();
            $table->tinyInteger('complainant_education')->change();
        });

        Schema::table('respondents', function (Blueprint $table) {
            // Revert address fields back to integer
            $table->integer('respondent_barangay')->change();
            $table->integer('respondent_city')->change();
            $table->integer('respondent_province')->change();
            $table->integer('respondent_region')->change();
            $table->integer('respondent_work_barangay')->change();
            $table->integer('respondent_work_city')->change();
            $table->integer('respondent_work_province')->change();
            $table->integer('respondent_work_region')->change();
            
            // Revert demographic fields back to tinyInteger
            $table->tinyInteger('respondent_citizenship')->change();
            $table->tinyInteger('respondent_gender')->change();
            $table->tinyInteger('respondent_civil_status')->change();
            $table->tinyInteger('respondent_occupation')->change();
            $table->tinyInteger('respondent_education')->change();
        });
    }
};
