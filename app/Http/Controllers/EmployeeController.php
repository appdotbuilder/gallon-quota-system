<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display employee information and quota.
     */
    public function show(Request $request)
    {
        $employeeId = $request->query('employee_id');
        
        if (!$employeeId) {
            return redirect()->route('home');
        }

        $employee = Employee::where('employee_id', $employeeId)->first();
        
        if (!$employee) {
            return redirect()->route('home')->with('error', 'Employee ID not found.');
        }

        // Reset quota if needed
        $employee->resetQuotaIfNeeded();
        
        // Get recent request history
        $recentRequests = $employee->requests()
            ->with('employee')
            ->latest('input_time')
            ->take(10)
            ->get();

        return Inertia::render('employee/show', [
            'employee' => $employee,
            'recentRequests' => $recentRequests,
        ]);
    }

    /**
     * Process gallon request.
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,employee_id',
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();
        
        if (!$employee->canRequest($request->quantity)) {
            return back()->with('error', 'Insufficient quota. Remaining: ' . $employee->remaining_quota);
        }

        // Create the request
        $gallonRequest = $employee->requests()->create([
            'quantity' => $request->quantity,
            'status' => 'pending',
            'input_time' => now(),
        ]);

        // Reduce employee quota
        $employee->reduceQuota($request->quantity);

        // Update daily summary
        \App\Models\DailySummary::updateTodaysStats();

        return redirect()->route('employee.show', ['employee_id' => $employee->employee_id])
            ->with('success', 'Request submitted successfully! Request ID: ' . $gallonRequest->getKey());
    }

    /**
     * Process gallon output (pickup).
     */
    public function update(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,employee_id',
            'request_id' => 'required|exists:gallon_requests,id',
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();
        $gallonRequest = $employee->requests()->where('id', $request->request_id)
            ->where('status', 'ready')
            ->first();

        if (!$gallonRequest) {
            return back()->with('error', 'Request not found or not ready for pickup.');
        }

        // Mark as completed
        $gallonRequest->update([
            'status' => 'completed',
            'output_time' => now(),
        ]);

        // Update daily summary
        \App\Models\DailySummary::updateTodaysStats();

        return redirect()->route('employee.show', ['employee_id' => $employee->employee_id])
            ->with('success', 'Gallons picked up successfully!');
    }
}