<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respondent extends Model
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
        'respondent_family_name',
        'respondent_first_name',
        'respondent_middle_name',
        'respondent_birth_date',
        'respondent_place_of_birth',
        'respondent_citizenship',
        'respondent_gender',
        'respondent_civil_status',
        'respondent_occupation',
        'respondent_education',
        'respondent_email_address',
        'respondent_street',
        'respondent_village',
        'respondent_barangay',
        'respondent_city',
        'respondent_province',
        'respondent_region',
        'respondent_work_street',
        'respondent_work_village',
        'respondent_work_barangay',
        'respondent_work_city',
        'respondent_work_province',
        'respondent_work_region',
    ];

    /**
     * Get the blotter that owns the respondent.
     */
    public function blotter()
    {
        return $this->belongsTo(Blotter::class);
    }

    /**
     * Get the user that owns the respondent.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full name of the respondent.
     */
    public function getFullNameAttribute()
    {
        return trim($this->respondent_first_name . ' ' . 
                   $this->respondent_middle_name . ' ' . 
                   $this->respondent_family_name);
    }
}
