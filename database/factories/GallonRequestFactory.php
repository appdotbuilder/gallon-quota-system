<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\GallonRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GallonRequest>
 */
class GallonRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $inputTime = fake()->dateTimeBetween('-7 days', 'now');
        $hasOutput = fake()->boolean(60); // 60% chance of being completed
        
        return [
            'employee_id' => Employee::factory(),
            'quantity' => fake()->numberBetween(1, 5),
            'status' => fake()->randomElement(['pending', 'ready', 'completed']),
            'input_time' => $inputTime,
            'output_time' => $hasOutput ? fake()->dateTimeBetween($inputTime, 'now') : null,
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the request is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'output_time' => null,
        ]);
    }

    /**
     * Indicate that the request is ready for pickup.
     */
    public function ready(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'ready',
            'output_time' => null,
        ]);
    }

    /**
     * Indicate that the request is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'output_time' => fake()->dateTimeBetween($attributes['input_time'] ?? '-1 day', 'now'),
        ]);
    }

    /**
     * Indicate that the request was made today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'input_time' => fake()->dateTimeBetween('today', 'now'),
        ]);
    }
}