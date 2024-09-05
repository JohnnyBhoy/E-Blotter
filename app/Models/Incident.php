<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    /**
     * Table Incident.
     *
     * @var string
     */
    protected $table = 'incidents';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'incident_type',
        'date_reported',
        'time_reported',
        'date_of_incident',
        'time_of_incident',
        'purok',
        'barangay',
        'city',
        'province',
        'landmark_location',
        'family_name',
        'first_name',
        'middle_name',
        'age',
        'contact_number',
        'relationship_to_the_incident',
        'reporter_purok',
        'reporter_barangay',
        'reporter_city',
        'reporter_province',
        'reporter_zip_code',
        'narrative_of_incident',
        'number_of_people_involved',
        'perpetrator_details',
        'victim_details',
    ];
}
