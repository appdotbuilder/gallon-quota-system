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
        Schema::create('daily_summaries', function (Blueprint $table) {
            $table->id();
            $table->date('date')->unique()->comment('Date of the summary');
            $table->integer('total_requests')->default(0)->comment('Total gallons requested today');
            $table->integer('total_outputs')->default(0)->comment('Total gallons taken today');
            $table->integer('unique_requesters')->default(0)->comment('Number of unique employees who made requests');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_summaries');
    }
};