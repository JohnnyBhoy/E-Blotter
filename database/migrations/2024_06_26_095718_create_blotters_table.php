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
        Schema::create('blotters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('entry_number');
            $table->string('barangay');
            $table->string('date_reported');
            $table->string('time_of_report');
            $table->tinyInteger('incident_type');
            $table->text('narrative');
            $table->text('remarks');
            $table->text('complainant_signature');
            $table->string('recorded_by');
            $table->text('recorded_by_signature');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blotters');
    }
};
