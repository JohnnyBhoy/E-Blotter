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
        'barangay_code',
        'blotter_number',
        'complainant_id',
        'respondent_id',
        'details',
        'encoder',
    ];
}
