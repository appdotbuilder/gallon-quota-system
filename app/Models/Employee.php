<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

/**
 * App\Models\Employee
 *
 * @property int $id
 * @property string $employee_id
 * @property string $name
 * @property string $department
 * @property string $grade
 * @property string $location
 * @property int $monthly_quota
 * @property int $remaining_quota
 * @property \Illuminate\Support\Carbon|null $last_quota_reset
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\GallonRequest> $requests
 * @property-read int|null $requests_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee query()
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereDepartment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereMonthlyQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereRemainingQuota($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereLastQuotaReset($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Employee whereUpdatedAt($value)
 * @method static \Database\Factories\EmployeeFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'name',
        'department',
        'grade',
        'location',
        'monthly_quota',
        'remaining_quota',
        'last_quota_reset',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'last_quota_reset' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Grade quota mapping.
     *
     * @var array<string, int>
     */
    public static array $gradeQuotas = [
        'G7' => 24,
        'G8' => 24,
        'G9' => 12,
        'G10' => 10,
        'G11' => 7,
        'G12' => 7,
        'G13' => 7,
    ];

    /**
     * Get the requests for the employee.
     */
    public function requests(): HasMany
    {
        return $this->hasMany(GallonRequest::class);
    }

    /**
     * Get the employee's monthly quota based on grade.
     */
    public function getQuotaForGrade(): int
    {
        return self::$gradeQuotas[$this->grade] ?? 0;
    }

    /**
     * Reset quota if it's a new month.
     */
    public function resetQuotaIfNeeded(): void
    {
        $now = Carbon::now();
        $lastReset = $this->last_quota_reset;
        
        if (!$lastReset || $lastReset->month !== $now->month || $lastReset->year !== $now->year) {
            $this->update([
                'remaining_quota' => $this->getQuotaForGrade(),
                'last_quota_reset' => $now->toDateString(),
            ]);
        }
    }

    /**
     * Check if employee can request specified quantity.
     */
    public function canRequest(int $quantity): bool
    {
        $this->resetQuotaIfNeeded();
        return $this->remaining_quota >= $quantity;
    }

    /**
     * Reduce quota after request.
     */
    public function reduceQuota(int $quantity): void
    {
        $this->decrement('remaining_quota', $quantity);
    }
}