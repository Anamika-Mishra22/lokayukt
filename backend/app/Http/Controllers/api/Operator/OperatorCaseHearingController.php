<?php

namespace App\Http\Controllers\api\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OperatorCaseHearingController extends Controller
{
   
    public function updateHearingDate(Request $request, $id)
    {
        // Validation
        $request->validate([
            'hearing_date' => 'required|date'
        ]);

        // Role check
        if (!in_array(auth()->user()->role->name, ['operator'])) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Update
        $updated = DB::table('complaints')
            ->where('id', $id)
            ->update([
                'next_hearing_date' => $request->hearing_date
            ]);

        return response()->json([
            'status' => true,
            'message' => 'Hearing date updated successfully',
            'data' => [
                'complaint_id' => $id,
                'next_hearing_date' => $request->hearing_date
            ]
        ]);
    }

    public function causeList(Request $request)
    {
      
    $query = DB::table('complaints')
    ->leftJoin('users as u', 'complaints.deal_person_id', '=', 'u.id')
    ->select('complaints.*', 'u.name as bench_person_name');

if (!empty($request->complain_id)) {
    $query->where('complaints.id', $request->complain_id);
}

if (!empty($request->date)) {
    $query->whereDate('complaints.next_hearing_date', $request->date);
}

$data = $query->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Cause list fetched successfully',
            // 'date' => $date,
            // 'total_cases' => count($cases),
            'data' => $data
        ]);
    }
}
