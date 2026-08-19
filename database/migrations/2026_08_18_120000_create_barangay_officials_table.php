<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Barangay officials directory.
 *
 * The /officials page has been in the barangay sidebar since the start but had
 * no table, no controller and no UI behind it -- it rendered the literal text
 * "Officials Page". Each barangay account owns its own roster.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('barangay_officials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('position');
            $table->string('contact_number')->nullable();
            $table->string('email')->nullable();
            $table->date('term_start')->nullable();
            $table->date('term_end')->nullable();
            $table->boolean('is_active')->default(true);
            // Lower sorts first, so the roster reads in rank order.
            $table->unsignedSmallInteger('sort_order')->default(100);
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('barangay_officials');
    }
};
