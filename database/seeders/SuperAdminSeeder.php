<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * The super admin account (role 1).
 *
 * Registration hardcodes barangay, so an account above barangay level can only
 * be provisioned out of band — this is that. The super admin sits at national
 * level: App\Support\Jurisdiction gives it every region, so it needs no
 * `user_addresses` row of its own.
 *
 * Credentials come from the environment, with a first-run default that must be
 * changed. Idempotent: it matches on email, so re-running updates the existing
 * account instead of creating a second one, and never overwrites a password that
 * has already been changed unless SUPER_ADMIN_PASSWORD is set.
 */
class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('SUPER_ADMIN_EMAIL', 'superadmin@eblotter.gov.ph');
        $name = env('SUPER_ADMIN_NAME', 'Super Admin');
        $password = env('SUPER_ADMIN_PASSWORD');

        $existing = User::where('email', $email)->first();

        if ($existing) {
            $existing->name = $name;
            $existing->role = User::ROLE_SUPER_ADMIN;
            $existing->is_admin = true;

            // Only reset the password when one was explicitly supplied.
            if ($password) {
                $existing->password = $password; // hashed by the model cast
            }

            $existing->save();

            $this->command->info("Super admin {$email} already exists — refreshed its role.");

            return;
        }

        $password = $password ?: 'ChangeMe@123';

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password, // hashed by the model cast
            'role' => User::ROLE_SUPER_ADMIN,
        ]);

        // `is_admin` is not in $fillable, and the Filament panel gate reads it.
        $user->is_admin = true;
        $user->email_verified_at = now();
        $user->save();

        $this->command->info("Super admin created: {$email}");

        if (!env('SUPER_ADMIN_PASSWORD')) {
            $this->command->warn("  Default password 'ChangeMe@123' — change it, or set SUPER_ADMIN_PASSWORD and re-run.");
        }
    }
}
