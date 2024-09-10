<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    /**
     * Table Contact Us.
     *
     * @var string
     */
    protected $table = 'contact_us';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'email_address',
        'subject',
        'message'
    ];
}
