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
        'respondent_first_name',
        'respondent_middle_name',
        'respondent_last_name',
        'respondent_qualifier',
        'respondent_address_line_1',
        'respondent_purok',
        'respondent_barangay',
        'respondent_city',
        'respondent_province',
        'respondent_region',
        'respondent_gender',
        'respondent_age',
        'respondent_first_name',
        'respondent_middle_name',
        'respondent_last_name',
        'respondent_qualifier',
        'respondent_address_line_1',
        'respondent_purok',
        'respondent_barangay',
        'respondent_city',
        'respondent_province',
        'respondent_region',
        'respondent_gender',
        'respondent_age',
    ];
}
