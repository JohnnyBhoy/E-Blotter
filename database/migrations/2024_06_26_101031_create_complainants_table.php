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
            $table->string('complainant_first_name');
            $table->string('complainant_middle_name');
            $table->string('complainant_last_name');
            $table->string('complainant_qualifier');
            $table->string('complainant_room');
            $table->string('complainant_lot');
            $table->string('complainant_block');
            $table->string('complainant_purok');
            $table->string('complainant_barangay');
            $table->string('complainant_city');
            $table->string('complainant_province');
            $table->string('complainant_region');
            $table->string('complainant_gender');
            $table->dateTime('complainant_birth_date');
            $table->string('complainant_status');
            $table->bigInteger('complainant_phone_number');
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
