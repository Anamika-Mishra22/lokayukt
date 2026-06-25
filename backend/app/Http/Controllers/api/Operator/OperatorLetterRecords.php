<?php

namespace App\Http\Controllers\api\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LetterRecordsDoc;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\LetterRecords;
use App\Models\LetterAction;
use Illuminate\Support\Facades\Storage;

class OperatorLetterRecords extends Controller
{
    public function uploadDocument(Request $request)
    {
        $added_by = Auth::user()->id;

        // Validation for multiple files
        $validation = Validator::make($request->all(), [

            'id' => 'required',
            'type'        => 'required|string',
            'title'       => 'required|string',

            // Multiple file validation
            'file'        => 'required|array',
            'file.*'      => 'file|mimes:jpg,jpeg,png,pdf|max:2048',

        ], [

            'id.required' => 'Id is required.',
            'type.required'        => 'Complaint description is required.',
            'title.required'       => 'Letter Subject is Required.',
            'file.required'        => 'At least one file is required.',
            'file.array'           => 'Invalid file format.',
            'file.*.mimes'         => 'Only JPG, PNG and PDF files are allowed.',
            'file.*.max'           => 'Each file must be less than 2MB.',

        ]);

        if ($validation->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validation->errors()
            ], 422);
        }

        if ($request->hasFile('file')) {

            $uploadedFiles = [];

            foreach ($request->file('file') as $uploadedFile) {

                $fileName = 'doc_' . uniqid() . '.' . $uploadedFile->getClientOriginalExtension();

                $filePath = $uploadedFile->storeAs('Document', $fileName, 'public');

                $compDoc = new LetterRecordsDoc();
                // $compDoc->letter_no = $request->letter_no;
                $compDoc->added_by   = $added_by;
                $compDoc->record_id   = $request->id;
                $compDoc->type       = $request->type;
                $compDoc->title      = $request->title;
                $compDoc->file       = $fileName;

                $compDoc->save();

                $uploadedFiles[] = $compDoc;
            }

            return response()->json([
                'status'  => true,
                'message' => 'Letter uploaded successfully.',
                'data'    => $uploadedFiles
            ], 201);
        }

        return response()->json([
            'status' => false,
            'message' => 'No files found.'
        ], 400);
    }

    public function getUploadDoc(Request $request,$id){
             $added_by = Auth::user()->id;
        // if($request->isMethod('get')){

        //     //    $cmp = LetterRecordsDoc::findOrFail($id);
        //     //     $cmpNO = ($cmp->COMP_NO < 10) ? '0' . $cmp->COMP_NO : $cmp->COMP_NO;
        //     //         $cmpY = $cmp->YEAR1;
        //     //         // $baseurl = 'http://192.168.0.251/api';
        //     //         $path = Storage::url('/'.$cmpY .'-'.$cmpY.'CP');
        //     //         $cmp->cp = $path;
                

        //     $complain = LetterRecordsDoc::find($id);

        //    return response()->json([
        //             'status' => true,
        //             'message' => 'Document Fetch successfully.',
        //             'data' => $complain
        //         ], 200);
        // }


          $cmp = LetterRecords::findOrFail($id);
        

            // 46/77 → 46-77
            $formatted = str_replace('/', '-', $cmp->letter_no);


            $response = [];

            // 🔹 1. CP/NP files
            foreach (['CP', 'NP'] as $type) {
                $file = 'letter-records/' . $formatted . $type . '.pdf';

                if (Storage::disk('public')->exists($file)) {
                    // $response[] = Storage::disk('public')->url($file);
                     $response[] = [
                        'file_name' => $formatted . $type ,
                        'url' => Storage::disk('public')->url($file)
                    ];
                }
            }
            // dd($response);
            
            // 🔹 2. DB files
            $complainDocs = LetterRecordsDoc::where('record_id', $cmp->id)->get();
            // dd($complainDocs);
            foreach ($complainDocs as $doc) {
            
                if (!empty($doc->file)) {
                    // $response[] = Storage::disk('public')->url('Document'.'/'.$doc->file);
                    $response[] = [
                        'file_name' => $doc->title,
                        'url' => Storage::disk('public')->url('Document'.'/'.$doc->file)
                    ];
                }
            }


             return response()->json([
                    'status' => true,
                    'message' => 'Document Fetch successfully.',
                    'data' => $response
                ], 200);
                
    }

    // public function getLetterRecord(Request $request,$id){
    //       if($request->isMethod('get')){

    //         //    $cmp = LetterRecordsDoc::findOrFail($id);
    //         //     $cmpNO = ($cmp->COMP_NO < 10) ? '0' . $cmp->COMP_NO : $cmp->COMP_NO;
    //         //         $cmpY = $cmp->YEAR1;
    //         //         // $baseurl = 'http://192.168.0.251/api';
    //         //         $path = Storage::url('/'.$cmpY .'-'.$cmpY.'CP');
    //         //         $cmp->cp = $path;
                

    //         $complain = LetterRecords::find($id);

    //        return response()->json([
    //                 'status' => true,
    //                 'message' => 'Document Fetch successfully.',
    //                 'data' => $complain
    //             ], 200);
    //     }
       
    // }

      public function getLetterRecord(Request $request,$id){
          if($request->isMethod('get')){

            //    $cmp = LetterRecordsDoc::findOrFail($id);
            //     $cmpNO = ($cmp->COMP_NO < 10) ? '0' . $cmp->COMP_NO : $cmp->COMP_NO;
            //         $cmpY = $cmp->YEAR1;
            //         // $baseurl = 'http://192.168.0.251/api';
            //         $path = Storage::url('/'.$cmpY .'-'.$cmpY.'CP');
            //         $cmp->cp = $path;
                

            // $complain = LetterRecords::find($id);
            $complain = DB::table('letters_record')
                         ->where('id',$id)->first();
                  $actions = DB::table('letter_actions')
                    ->where('record_id', $id)
                    ->orderBy('id', 'desc')
                    ->get();

                    $userIds = [];

                    /* Sab forward_* fields se IDs collect karo */
                    foreach ($actions as $row) {

                        foreach ($row as $key => $value) {

                            if (
                                str_starts_with($key, 'forward_') &&
                                is_numeric($value)
                            ) {
                                $userIds[] = $value;
                            }
                        }
                    }

                    $userIds = array_unique($userIds);

                    /* Users ka data lao */
                    $users = DB::table('users')
                        ->whereIn('id', $userIds)
                        ->pluck('name', 'id'); // id => name


                    /* IDs ko name me convert karo */
                    foreach ($actions as $row) {

                        foreach ($row as $key => $value) {

                            if (
                                str_starts_with($key, 'forward_') &&
                                is_numeric($value)
                            ) {
                                $row->{$key . '_name'} = $users[$value] ?? null;
                            }
                        }
                    }

                    /* Final assign */
                    $complain->actions = $actions;


           return response()->json([
                    'status' => true,
                    'message' => 'Document Fetch successfully.',
                    'data' => $complain
                ], 200);
        }
       
    }


//     public function searchLetterRecords(Request $request)
// {
//     // dd($request->all());
//     $query = DB::table('letters_record');
    

//     if (!empty($request->rack)) {
//         $query->where('rack', $request->rack);
//     }
//     if (!empty($request->almirah)){
//         $query->where('almirah', $request->almirah);
//     }
//     if (!empty($request->row)) {
//         $query->where('row', $request->row);
//     }

  


//     if (!empty($request->letter_no)) {
//         $query->where('letter_no', 'Like', '%'.$request->letter_no.'%');
//     }

 
//    if (!empty($request->year)) {
//         $lastTwoDigits = substr($request->year, -2);

//         $query->whereRaw(
//             "RIGHT(SUBSTRING_INDEX(letter_no, '/', -1), 2) = ?",
//             [$lastTwoDigits]
//         );
//     }                           


//     $data = $query->get();
//     // $data = $query->paginate(10);

//      return response()->json([
//                 'status' => true,
//                 'message' => 'Records Fetch successfully',
//                 'data' =>  $data,
//             ]);
// }

public function searchLetterRecords(Request $request)
{
    $query = DB::table('letters_record');

    if ($request->filled('rack')) {
        $query->where('rack', $request->rack);
    }

    if ($request->filled('almirah')) {
        $query->where('almirah', $request->almirah);
    }

    if ($request->filled('row')) {
        $query->where('row', $request->row);
    }

    if ($request->filled('letter_no')) {
        $query->where('letter_no', 'LIKE', '%' . $request->letter_no . '%');
    }

    if ($request->filled('year')) {
        $lastTwoDigits = substr($request->year, -2);

        $query->whereRaw(
            "RIGHT(SUBSTRING_INDEX(letter_no, '/', -1), 2) = ?",
            [$lastTwoDigits]
        );
    }

    $data = $query->paginate(50);

    return response()->json([
        'status' => true,
        'message' => 'Records Fetch successfully',
        'data' => $data,
    ]);
}
    public function getAllLetters(Request $request)
{
    $query = DB::table('letters_record as lr')
    ->join('letters_record_documents as lrd','lr.id','lrd.record_id')
    ->select('lr.*');
    

    $data = $query->whereNotNull('lrd.record_id')->distinct('lr.id')->paginate(10);

     return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $data,
            ]);
}
    public function getAllSendLetters(Request $request)
{
    $query = DB::table('letters_record as lr')
    ->join('letters_record_documents as lrd','lr.id','lrd.record_id') ->select('lr.*');
    

    $data = $query->where('lr.approved_rejected_by_rk','1')->paginate(10);

     return response()->json([
                'status' => true,
                'message' => 'Records Fetch successfully',
                'data' =>  $data,
            ]);
}

     public function approvedLetterByRk(Request $request,$id){
         $userId = Auth::user()->id;
        if(isset($id) && $request->isMethod('post')){

                $apc = LetterRecords::findOrFail($id);
                $apc->approved_rejected_by_rk = 1;
                $apc->approved_by_ro_id =  $userId;
                $apc->save();
                // if($apc->save()){
                //      $apcAction = new LetterAction();
                //     $apcAction->record_id = $id;
                //     $apcAction->status = 'Verified';
                //     $apcAction->remarks = "File received";
                //     $apcAction->forward_by_rk = $userId;
                //     $apcAction->save();
                // }
           
    
              return response()->json([
                'status' => 'success',
                'message' => 'Approved Successfully',
                'data' => $apc
                
            ]);
        }else{
             return response()->json([
                'status' => 'failed',
                'message' => 'Please Check Id'
                
            ]);
        }
        
    }


}
