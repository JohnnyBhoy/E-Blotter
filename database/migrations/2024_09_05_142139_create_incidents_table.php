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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id();
            $table->string('incident_type');
            $table->string('date_reported');
            $table->string('time_reported');
            $table->string('date_of_incident');
            $table->string('time_of_incident');
            $table->string('purok');
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('landmark_location');
            $table->string('family_name');
            $table->string('first_name');
            $table->string('middle_name');
            $table->integer('age');
            $table->bigInteger('contact_number');
            $table->string('relationship_to_the_incident');
            $table->string('reporter_purok');
            $table->string('reporter_barangay');
            $table->string('reporter_city');
            $table->string('reporter_province');
            $table->integer('reporter_zip_code');
            $table->text('narrative_of_incident');
            $table->integer('number_of_people_involved');
            $table->text('perpetrator_details');
            $table->text('victim_details');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
