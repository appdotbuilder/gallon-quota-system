<?php

use App\Http\Controllers\AdminHrController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminWarehouseController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Home page - main gallon quota system
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Employee access routes
Route::controller(EmployeeController::class)->group(function () {
    Route::get('/employee', 'show')->name('employee.show');
    Route::post('/employee', 'store')->name('employee.store');
    Route::patch('/employee', 'update')->name('employee.update');
});

// Admin HR routes
Route::prefix('admin/hr')->name('admin.hr.')->group(function () {
    Route::resource('/', AdminHrController::class)->parameters(['' => 'employee']);
});

// Admin Warehouse routes
Route::prefix('admin/warehouse')->name('admin.warehouse.')->group(function () {
    Route::get('/', [AdminWarehouseController::class, 'index'])->name('index');
    Route::post('/', [AdminWarehouseController::class, 'store'])->name('store');
});

// Admin Report routes
Route::prefix('admin/report')->name('admin.report.')->group(function () {
    Route::get('/', [AdminReportController::class, 'index'])->name('index');
    Route::post('/download', [AdminReportController::class, 'store'])->name('download');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
