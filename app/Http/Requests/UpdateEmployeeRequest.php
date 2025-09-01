<?php

namespace App\Http\Requests;

use App\Models\Employee;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'string',
                'max:20',
                Rule::unique('employees', 'employee_id')->ignore($this->route('employee'))
            ],
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:100',
            'grade' => ['required', Rule::in(array_keys(Employee::$gradeQuotas))],
            'location' => 'required|string|max:100',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.unique' => 'This Employee ID is already taken by another employee.',
            'name.required' => 'Employee name is required.',
            'department.required' => 'Department is required.',
            'grade.required' => 'Grade is required.',
            'grade.in' => 'Invalid grade selected.',
            'location.required' => 'Location is required.',
        ];
    }
}