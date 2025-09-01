<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\GallonRequest;
use App\Models\DailySummary;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Create sample employees
        $employees = Employee::factory(50)->create();
        
        // Create some requests for the employees
        $employees->each(function ($employee) {
            // Reset quota for current month
            $employee->resetQuotaIfNeeded();
            
            // Create some random requests
            $requestCount = fake()->numberBetween(0, 3);
            for ($i = 0; $i < $requestCount; $i++) {
                $quantity = fake()->numberBetween(1, min(5, $employee->remaining_quota));
                if ($quantity > 0) {
                    $request = GallonRequest::factory()->create([
                        'employee_id' => $employee->id,
                        'quantity' => $quantity,
                        'status' => fake()->randomElement(['pending', 'ready', 'completed']),
                    ]);
                    
                    // Update employee quota
                    $employee->reduceQuota($quantity);
                }
            }
        });

        // Update today's summary
        DailySummary::updateTodaysStats();

        // Create some historical daily summaries
        for ($i = 1; $i <= 30; $i++) {
            DailySummary::factory()->create([
                'date' => now()->subDays($i)->format('Y-m-d'),
            ]);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Sample employees created with various grades and quotas.');
        $this->command->info('Some employees have existing requests in different statuses.');
        $this->command->info('Try scanning with employee IDs from the employees table.');
    }
}
