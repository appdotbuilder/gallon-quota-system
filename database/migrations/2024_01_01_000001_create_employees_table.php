<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->comment('Employee ID for barcode scanning');
            $table->string('name');
            $table->string('department');
            $table->enum('grade', ['G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13']);
            $table->string('location');
            $table->integer('monthly_quota')->comment('Monthly gallon quota based on grade');
            $table->integer('remaining_quota')->default(0)->comment('Remaining quota for current month');
            $table->date('last_quota_reset')->nullable()->comment('Last time quota was reset');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('employee_id');
            $table->index('grade');
            $table->index('department');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};