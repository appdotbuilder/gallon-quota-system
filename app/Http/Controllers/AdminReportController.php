<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DailySummary;
use App\Models\GallonRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    /**
     * Display administration dashboard.
     */
    public function index()
    {
        $todaysSummary = DailySummary::getTodaysSummary();
        
        // Get all today's requests with employee info
        $todaysRequests = GallonRequest::with('employee')
            ->today()
            ->latest('input_time')
            ->get();

        return Inertia::render('admin/report/index', [
            'todaysSummary' => $todaysSummary,
            'todaysRequests' => $todaysRequests,
        ]);
    }

    /**
     * Download daily report as Excel file.
     */
    public function store(Request $request)
    {
        $date = $request->input('date', today()->format('Y-m-d'));
        
        $requests = GallonRequest::with('employee')
            ->whereDate('input_time', $date)
            ->orderBy('input_time')
            ->get();

        $response = new StreamedResponse(function() use ($requests) {
            $handle = fopen('php://output', 'w');
            
            // Add BOM for proper UTF-8 encoding in Excel
            fputs($handle, "\xEF\xBB\xBF");
            
            // Header row
            fputcsv($handle, [
                'Employee ID',
                'Name',
                'Department',
                'Grade',
                'Location',
                'Quantity',
                'Input Date',
                'Input Time',
                'Output Date',
                'Output Time',
                'Status'
            ]);
            
            // Data rows
            foreach ($requests as $request) {
                fputcsv($handle, [
                    $request->employee->employee_id,
                    $request->employee->name,
                    $request->employee->department,
                    $request->employee->grade,
                    $request->employee->location,
                    $request->quantity,
                    $request->input_time->format('Y-m-d'),
                    $request->input_time->format('H:i:s'),
                    $request->output_time?->format('Y-m-d') ?? '',
                    $request->output_time?->format('H:i:s') ?? '',
                    ucfirst($request->status)
                ]);
            }
            
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="gallon_report_' . $date . '.csv"');

        return $response;
    }
}