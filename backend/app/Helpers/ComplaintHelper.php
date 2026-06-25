<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\UserActivityComplaintsLog;

class ComplaintHelper
{
    public static function storeComplaint($request)
    {
        // 🔹 Validation
        $validator = Validator::make($request->all(), [
            'user_id'      => 'required|integer',
            'user_name'    => 'required|string|max:255',
            'type'         => 'required|string|max:100',
            'file_name'    => 'required|string|max:100',
            'file_path'    => 'required|string|max:100'
        ]);

        if ($validator->fails()) {
            return [
                'status' => false,
                'code' => 422,
                'message' => $validator->errors()
            ];
        }

        // 🔹 Store Data
        $data = UserActivityComplaintsLog::create([
            'user_id'   => $request->user_id,
            'user_name' => $request->user_name,
            'type'      => $request->type,
            'file_name' => $request->file_name,
            'file_path' => $request->file_path,
        ]);

        return [
            'status' => true,
            'code' => 200,
            'message' => 'Complaint log created successfully',
            'data' => $data
        ];
    }
}