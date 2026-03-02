<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable  //implements MustVerifyEmail
{
    use HasFactory, Notifiable;

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
        'province_id',
        'municipality_id',
        'station_id',
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
        ];
    }

    // Hierarchical Relationships

    /**
     * Get the province that this user belongs to (if user is municipality, station, or barangay)
     */
    public function province()
    {
        return $this->belongsTo(User::class, 'province_id');
    }

    /**
     * Get the municipality that this user belongs to (if user is station or barangay)
     */
    public function municipality()
    {
        return $this->belongsTo(User::class, 'municipality_id');
    }

    /**
     * Get the station that this user belongs to (if user is barangay)
     */
    public function station()
    {
        return $this->belongsTo(User::class, 'station_id');
    }

    /**
     * Get municipalities under this province
     */
    public function municipalities()
    {
        return $this->hasMany(User::class, 'province_id')->where('role', 3);
    }

    /**
     * Get stations under this province
     */
    public function provinceStations()
    {
        return $this->hasMany(User::class, 'province_id')->where('role', 4);
    }

    /**
     * Get barangays under this province
     */
    public function provinceBarangays()
    {
        return $this->hasMany(User::class, 'province_id')->where('role', 5);
    }

    /**
     * Get barangays under this municipality
     */
    public function barangays()
    {
        return $this->hasMany(User::class, 'municipality_id')->where('role', 5);
    }

    /**
     * Get barangays under this station
     */
    public function stationBarangays()
    {
        return $this->hasMany(User::class, 'station_id')->where('role', 5);
    }

    /**
     * Get all users under this province (municipalities, stations, barangays)
     */
    public function provinceUsers()
    {
        return $this->hasMany(User::class, 'province_id')->whereIn('role', [3, 4, 5]);
    }

    /**
     * Get all users under this municipality (barangays)
     */
    public function municipalityUsers()
    {
        return $this->hasMany(User::class, 'municipality_id')->where('role', 5);
    }

    /**
     * Get all users under this station (barangays)
     */
    public function stationUsers()
    {
        return $this->hasMany(User::class, 'station_id')->where('role', 5);
    }

    // Helper methods for hierarchy
    public function isProvince()
    {
        return $this->role === 1 || $this->role === 2;
    }

    public function isMunicipality()
    {
        return $this->role === 3;
    }

    public function isStation()
    {
        return $this->role === 4;
    }

    public function isBarangay()
    {
        return $this->role === 5;
    }

    public function getRoleNameAttribute()
    {
        return match ($this->role) {
            1 => 'Super Admin',
            2 => 'Province',
            3 => 'Municipality',
            4 => 'Station',
            5 => 'Barangay',
            default => 'Unknown',
        };
    }

    /**
     * Get the blotters for this user.
     */
    public function blotters()
    {
        return $this->hasMany(Blotter::class);
    }
}
