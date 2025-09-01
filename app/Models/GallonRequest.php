<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\GallonRequest
 *
 * @property int $id
 * @property int $employee_id
 * @property int $quantity
 * @property string $status
 * @property \Illuminate\Support\Carbon $input_time
 * @property \Illuminate\Support\Carbon|null $output_time
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereInputTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereOutputTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest pending()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest ready()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest completed()
 * @method static \Illuminate\Database\Eloquent\Builder|GallonRequest today()
 * @method static \Database\Factories\GallonRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class GallonRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'quantity',
        'status',
        'input_time',
        'output_time',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'input_time' => 'datetime',
        'output_time' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the request.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include ready requests.
     */
    public function scopeReady($query)
    {
        return $query->where('status', 'ready');
    }

    /**
     * Scope a query to only include completed requests.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include today's requests.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('input_time', today());
    }
}