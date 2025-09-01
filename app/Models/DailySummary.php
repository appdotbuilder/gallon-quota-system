<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\DailySummary
 *
 * @property int $id
 * @property \Illuminate\Support\Carbon $date
 * @property int $total_requests
 * @property int $total_outputs
 * @property int $unique_requesters
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary query()
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereTotalRequests($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereTotalOutputs($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereUniqueRequesters($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|DailySummary whereUpdatedAt($value)
 * @method static \Database\Factories\DailySummaryFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class DailySummary extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'date',
        'total_requests',
        'total_outputs',
        'unique_requesters',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get or create today's summary.
     */
    public static function getTodaysSummary(): self
    {
        return self::firstOrCreate(
            ['date' => today()],
            [
                'total_requests' => 0,
                'total_outputs' => 0,
                'unique_requesters' => 0,
            ]
        );
    }

    /**
     * Update today's summary statistics.
     */
    public static function updateTodaysStats(): void
    {
        $today = today();
        $summary = self::getTodaysSummary();
        
        // Get today's requests
        $todaysRequests = GallonRequest::whereDate('input_time', $today)->get();
        
        $summary->update([
            'total_requests' => $todaysRequests->sum('quantity'),
            'total_outputs' => $todaysRequests->whereNotNull('output_time')->sum('quantity'),
            'unique_requesters' => $todaysRequests->unique('employee_id')->count(),
        ]);
    }
}