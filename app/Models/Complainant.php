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
        'complainant_first_name',
        'complainant_middle_name',
        'complainant_last_name',
        'complainant_qualifier',
        'complainant_address_line_1',
        'complainant_purok',
        'complainant_barangay',
        'complainant_city',
        'complainant_province',
        'complainant_region',
        'complainant_gender',
        'complainant_age',
    ];
}
