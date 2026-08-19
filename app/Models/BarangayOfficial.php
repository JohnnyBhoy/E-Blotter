<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BarangayOfficial extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'position',
        'contact_number',
        'email',
        'term_start',
        'term_end',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'term_start' => 'date',
            'term_end' => 'date',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** The barangay account this official belongs to. */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
