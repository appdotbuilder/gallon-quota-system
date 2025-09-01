<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = fake()->randomElement(['G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13']);
        $quota = Employee::$gradeQuotas[$grade];
        
        return [
            'employee_id' => fake()->unique()->numerify('EMP####'),
            'name' => fake()->name(),
            'department' => fake()->randomElement(['HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Production']),
            'grade' => $grade,
            'location' => fake()->randomElement(['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Makassar']),
            'monthly_quota' => $quota,
            'remaining_quota' => fake()->numberBetween(0, $quota),
            'last_quota_reset' => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }

    /**
     * Indicate that the employee is a high-grade employee.
     */
    public function highGrade(): static
    {
        return $this->state(fn (array $attributes) => [
            'grade' => fake()->randomElement(['G7', 'G8']),
        ])->afterMaking(function (Employee $employee) {
            $employee->monthly_quota = Employee::$gradeQuotas[$employee->grade];
            $employee->remaining_quota = fake()->numberBetween(0, $employee->monthly_quota);
        });
    }

    /**
     * Indicate that the employee has no remaining quota.
     */
    public function noQuota(): static
    {
        return $this->state(fn (array $attributes) => [
            'remaining_quota' => 0,
        ]);
    }
}