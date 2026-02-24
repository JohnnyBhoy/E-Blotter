<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complainant extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'blotter_id',
        'user_id',
        'entry_number',
        'complainant_family_name',
        'complainant_first_name',
        'complainant_middle_name',
        'complainant_birth_date',
        'complainant_place_of_birth',
        'complainant_citizenship',
        'complainant_gender',
        'complainant_civil_status',
        'complainant_occupation',
        'complainant_education',
        'complainant_email_address',
        'complainant_street',
        'complainant_village',
        'complainant_barangay',
        'complainant_city',
        'complainant_province',
        'complainant_region',
        'complainant_work_street',
        'complainant_work_village',
        'complainant_work_barangay',
        'complainant_work_city',
        'complainant_work_province',
        'complainant_work_region',
    ];

    /**
     * Get the blotter that owns the complainant.
     */
    public function blotter()
    {
        return $this->belongsTo(Blotter::class);
    }

    /**
     * Get the user that owns the complainant.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name of the complainant.
     */
    public function getFullNameAttribute()
    {
        return trim($this->complainant_first_name . ' ' . 
                   $this->complainant_middle_name . ' ' . 
                   $this->complainant_family_name);
    }
}
