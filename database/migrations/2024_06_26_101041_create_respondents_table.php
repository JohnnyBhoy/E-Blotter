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
        Schema::create('respondents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('blotter_id');
            $table->string('respondent_family_name');
            $table->string('respondent_first_name');
            $table->string('respondent_middle_name');
            $table->string('respondent_birth_date');
            $table->string('respondent_place_of_birth');
            $table->tinyInteger('respondent_citizenship');
            $table->tinyInteger('respondent_gender');
            $table->tinyInteger('respondent_civil_status');
            $table->tinyInteger('respondent_occupation');
            $table->tinyInteger('respondent_education');
            $table->string('respondent_email_address')->nullable();
            $table->string('respondent_street');
            $table->string('respondent_village');
            $table->integer('respondent_barangay');
            $table->integer('respondent_city');
            $table->integer('respondent_province');
            $table->integer('respondent_region');
            $table->string('respondent_work_street');
            $table->string('respondent_work_village');
            $table->integer('respondent_work_barangay');
            $table->integer('respondent_work_city');
            $table->integer('respondent_work_province');
            $table->integer('respondent_work_region');
            $table->timestamps();

            $table->foreign('blotter_id')->references('id')->on('blotters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respondents');
    }
};
