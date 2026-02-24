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

    /**
     * Get the user that owns the blotter.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the complainant for the blotter.
     */
    public function complainant()
    {
        return $this->hasOne(Complainant::class);
    }

    /**
     * Get the respondent for the blotter.
     */
    public function respondent()
    {
        return $this->hasOne(Respondent::class);
    }
}
