<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Requests\UpdateEmployeeRequest;
use App\Models\Employee;
use Inertia\Inertia;

class AdminHrController extends Controller
{
    /**
     * Display a listing of employees.
     */
    public function index()
    {
        $employees = Employee::latest()->paginate(15);
        
        return Inertia::render('admin/hr/index', [
            'employees' => $employees
        ]);
    }

    /**
     * Show the form for creating a new employee.
     */
    public function create()
    {
        return Inertia::render('admin/hr/create');
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $data = $request->validated();
        $data['monthly_quota'] = Employee::$gradeQuotas[$data['grade']];
        $data['remaining_quota'] = $data['monthly_quota'];
        $data['last_quota_reset'] = today();

        $employee = Employee::create($data);

        return redirect()->route('admin.hr.show', $employee)
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee)
    {
        $employee->load('requests');
        
        return Inertia::render('admin/hr/show', [
            'employee' => $employee
        ]);
    }

    /**
     * Show the form for editing the employee.
     */
    public function edit(Employee $employee)
    {
        return Inertia::render('admin/hr/edit', [
            'employee' => $employee
        ]);
    }

    /**
     * Update the specified employee.
     */
    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $data = $request->validated();
        
        // Update quota if grade changed
        if ($employee->grade !== $data['grade']) {
            $data['monthly_quota'] = Employee::$gradeQuotas[$data['grade']];
            // Reset quota for new grade
            $data['remaining_quota'] = $data['monthly_quota'];
            $data['last_quota_reset'] = today();
        }

        $employee->update($data);

        return redirect()->route('admin.hr.show', $employee)
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified employee.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('admin.hr.index')
            ->with('success', 'Employee deleted successfully.');
    }
}