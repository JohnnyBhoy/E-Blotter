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
            $table->string('respondent_first_name');
            $table->string('respondent_middle_name');
            $table->string('respondent_last_name');
            $table->string('respondent_qualifier');
            $table->string('respondent_address_line_1');
            $table->string('respondent_purok');
            $table->string('respondent_barangay');
            $table->string('respondent_city');
            $table->string('respondent_province');
            $table->string('respondent_region');
            $table->string('respondent_gender');
            $table->tinyInteger('respondent_age');
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
