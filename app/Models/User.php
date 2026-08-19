<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    /** Super admin. Matches the `role` values documented in CLAUDE.md. */
    public const ROLE_SUPER_ADMIN = 1;
    public const ROLE_BARANGAY = 2;
    public const ROLE_STATION = 3;
    public const ROLE_PROVINCE = 4;
    public const ROLE_REGION = 5;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'lang',
        'lat',
        'avatar',
        'banner',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'role' => 'integer',
        ];
    }

    /**
     * The account one level up the chain of command — the station above a
     * barangay, the province above a station, the super admin above the
     * province. Null at the root.
     *
     * `parent_id` is deliberately not mass assignable: it is set by the
     * provisioning seeders, never by a form.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /** The accounts one level down — a province's stations, a station's barangays. */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    /** PSGC codes that pin this account to its jurisdiction. */
    public function address(): HasOne
    {
        return $this->hasOne(UserAddress::class);
    }

    /**
     * Gate for the Filament panel at /admin.
     *
     * Filament only consults this method (via FilamentUser). The panel provider
     * previously declared an authorize() method that Filament never calls, and
     * UserResource declared a canAccessPanel() that only applies to the User
     * model — so every signed-in user could reach the admin panel.
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->is_admin || $this->role === self::ROLE_SUPER_ADMIN;
    }
}
