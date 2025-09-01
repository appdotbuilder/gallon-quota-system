<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DailySummary;
use App\Models\GallonRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminWarehouseController extends Controller
{
    /**
     * Display warehouse dashboard.
     */
    public function index()
    {
        $todaysSummary = DailySummary::getTodaysSummary();
        
        // Get pending and ready requests for today
        $pendingRequests = GallonRequest::with('employee')
            ->pending()
            ->today()
            ->latest('input_time')
            ->get();

        $readyRequests = GallonRequest::with('employee')
            ->ready()
            ->today()
            ->latest('input_time')
            ->get();

        return Inertia::render('admin/warehouse/index', [
            'todaysSummary' => $todaysSummary,
            'pendingRequests' => $pendingRequests,
            'readyRequests' => $readyRequests,
        ]);
    }

    /**
     * Verify stock availability and mark request as ready.
     */
    public function store(Request $request)
    {
        $request->validate([
            'request_id' => 'required|exists:gallon_requests,id',
        ]);

        $gallonRequest = GallonRequest::findOrFail($request->request_id);
        
        if ($gallonRequest->status !== 'pending') {
            return back()->with('error', 'Request is not in pending status.');
        }

        $gallonRequest->update(['status' => 'ready']);

        return back()->with('success', 'Request verified and marked as ready for pickup.');
    }
}