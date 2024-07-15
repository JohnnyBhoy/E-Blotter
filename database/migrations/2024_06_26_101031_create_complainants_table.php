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
        Schema::create('complainants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('blotter_id');
            $table->string('complainant_family_name');
            $table->string('complainant_first_name');
            $table->string('complainant_middle_name')->nullable();
            $table->string('complainant_birth_date');
            $table->string('complainant_place_of_birth')->nullable();
            $table->tinyInteger('complainant_citizenship');
            $table->tinyInteger('complainant_gender');
            $table->tinyInteger('complainant_civil_status');
            $table->tinyInteger('complainant_occupation');
            $table->tinyInteger('complainant_education');
            $table->string('complainant_email_address')->nullable();
            $table->string('complainant_street')->nullable();
            $table->string('complainant_village')->nullable();
            $table->integer('complainant_barangay');
            $table->integer('complainant_city');
            $table->integer('complainant_province');
            $table->integer('complainant_region');
            $table->string('complainant_work_street')->nullable();
            $table->string('complainant_work_village')->nullable();
            $table->integer('complainant_work_barangay');
            $table->integer('complainant_work_city');
            $table->integer('complainant_work_province');
            $table->integer('complainant_work_region');
            $table->timestamps();

            $table->foreign('blotter_id')->references('id')->on('blotters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complainants');
    }
};
