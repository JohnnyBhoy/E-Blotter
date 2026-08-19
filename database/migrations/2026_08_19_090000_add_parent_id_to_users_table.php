<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The explicit jurisdiction tree: province -> municipality/station -> barangay.
 *
 * Scoping itself still runs off the PSGC codes in `user_addresses` — that is
 * what App\Support\Jurisdiction reads. `parent_id` records the same tree as a
 * real relation so the chain of command can be walked (and displayed) directly
 * from an account, without re-deriving it from codes.
 *
 * Nullable, because the super admin sits at the root and pre-existing accounts
 * have no parent until they are placed under one.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('users', 'parent_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->nullable()->after('role');

            $table->index('parent_id');
            $table->foreign('parent_id')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('users', 'parent_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};
