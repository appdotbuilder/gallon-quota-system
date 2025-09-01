<?php

namespace Database\Factories;

use App\Models\DailySummary;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DailySummary>
 */
class DailySummaryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalRequests = fake()->numberBetween(10, 100);
        $totalOutputs = fake()->numberBetween(5, $totalRequests);
        
        return [
            'date' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'total_requests' => $totalRequests,
            'total_outputs' => $totalOutputs,
            'unique_requesters' => fake()->numberBetween(5, 30),
        ];
    }

    /**
     * Indicate that this is today's summary.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => today(),
        ]);
    }
}