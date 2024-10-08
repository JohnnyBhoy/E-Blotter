<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blotter extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'entry_number',
        'barangay',
        'date_reported',
        'time_of_report',
        'date_of_incident',
        'time_of_incident',
        'incident_type',
        'narrative',
        'remarks',
        'complainant_signature',
        'recorded_by',
        'recorded_by_signature',
        'uploaded_file',
    ];
}
