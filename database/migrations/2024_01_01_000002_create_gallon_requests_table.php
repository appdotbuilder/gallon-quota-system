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
        Schema::create('gallon_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->integer('quantity')->comment('Number of gallons requested');
            $table->enum('status', ['pending', 'ready', 'completed'])->default('pending');
            $table->timestamp('input_time')->useCurrent()->comment('When request was made');
            $table->timestamp('output_time')->nullable()->comment('When gallons were taken');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['employee_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('input_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallon_requests');
    }
};