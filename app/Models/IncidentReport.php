<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'coordinates',
        'location',
        'incidentTypes',
        'description',
        'file',
        'status',
        'incident_responder',
    ];
}
