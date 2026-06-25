<?php

namespace App\Http\Controllers\api\Dispatch;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LetterRecordsDoc;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\LetterRecords;
use App\Models\LetterAction;
use App\Models\LetterNotes;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class DispatchLetterRecordsController extends Controller
{

     public function allLetters(){
        $user = Auth::user()->id;
        // dd($user);
     
    
    $query = DB::table('letters_record')
        //  ->leftJoin('letters_record_details as cd', 'letters_record.id', '=', 'cd.complain_id')
        ->leftJoin('letters_record_documents as dd', 'letters_record.id', '=', 'dd.record_id')
        ->leftJoin('letter_actions as rep', 'letters_record.id', '=', 'rep.record_id')
       
        ->select(
            'letters_record.*',
           

        );


    $query->where(function ($q) use ($user) {
                
                // $q->where(function ($inner) {
                //     $inner->where('approved_rejected_by_rk', 1)
                //         ->where('approved_rejected_by_us', 0);
                // })

                $q->where('rep.forward_to_dispatch', $user)

                ->orWhere(function ($inner) use ($user) {
                    $inner->where('dd.added_by', $user)
                        ->where('approved_rejected_by_dispatch', 0); 
                    });

                });
  

    $records = $query->distinct('letters_record.id')
                        ->orderBy('letters_record.updated_at', 'DESC')
                        ->get();

               


        return response()->json([
            'status' => true,
            'message' => 'Records fetched successfully',
            'data' => $records,
           
        ]);
    
    }

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

        // public function getUploadDoc(Request $request,$id){
        //          $added_by = Auth::user()->id;
        //     // if($request->isMethod('get')){

        //     //     //    $cmp = LetterRecordsDoc::findOrFail($id);
        //     //     //     $cmpNO = ($cmp->COMP_NO < 10) ? '0' . $cmp->COMP_NO : $cmp->COMP_NO;
        //     //     //         $cmpY = $cmp->YEAR1;
        //     //     //         // $baseurl = 'http://192.168.0.251/api';
        //     //     //         $path = Storage::url('/'.$cmpY .'-'.$cmpY.'CP');
        //     //     //         $cmp->cp = $path;
                    

        //     //     $complain = LetterRecordsDoc::find($id);

        //     //    return response()->json([
        //     //             'status' => true,
        //     //             'message' => 'Document Fetch successfully.',
        //     //             'data' => $complain
        //     //         ], 200);
        //     // }


        //       $cmp = LetterRecords::findOrFail($id);
            

        //         // 46/77 → 46-77
        //         $formatted = str_replace('/', '-', $cmp->letter_no);


        //         $response = [];

        //         // 🔹 1. CP/NP files
        //         foreach (['CP', 'NP'] as $type) {
        //             $file = 'letter-records/' . $formatted . $type . '.pdf';

        //             if (Storage::disk('public')->exists($file)) {
        //                 $response[] = Storage::disk('public')->url($file);
        //             }
        //         }
        //         // dd($response);
                
        //         // 🔹 2. DB files
        //         $complainDocs = LetterRecordsDoc::where('record_id', $cmp->id)->get();
        //         // dd($complainDocs);
        //         foreach ($complainDocs as $doc) {
                
        //             if (!empty($doc->file)) {
        //                 $response[] = Storage::disk('public')->url('Document'.'/'.$doc->file);
        //             }
        //         }


        //          return response()->json([
        //                 'status' => true,
        //                 'message' => 'Document Fetch successfully.',
        //                 'data' => $response
        //             ], 200);
                    
        // }

    public function getUploadDoc(Request $request,$id){
                $added_by = Auth::user()->id;
            
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


        public function getNoteLetterDocument(Request $request,$id){
                $added_by = Auth::user()->id;
            
            $cmp = LetterRecords::findOrFail($id);
            

                // 46/77 → 46-77
                $formatted = str_replace('/', '-', $cmp->letter_no);


                $response = [];

                // 🔹 1. CP/NP files
                // foreach (['CP', 'NP'] as $type) {
                //     $file = 'letter-records/' . $formatted . $type . '.pdf';

                //     if (Storage::disk('public')->exists($file)) {
                //         // $response[] = Storage::disk('public')->url($file);
                //          $response[] = [
                //             'file_name' => $formatted . $type ,
                //             'url' => Storage::disk('public')->url($file)
                //         ];
                //     }
                // }
                // dd($response);
                
                // 🔹 2. DB files
                $complainDocs = LetterRecordsDoc::where('record_id', $cmp->id)->get();
                // dd($complainDocs);
                foreach ($complainDocs as $doc) {
                
                    if (!empty($doc->file)) {
                        // $response[] = Storage::disk('public')->url('Document'.'/'.$doc->file);
                        $response[] = [
                            'id' => $doc->id,
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
    //     $query = DB::table('letters_record');
        

    //     if ($request->rack) {
    //         // $query->where('row_no', 'Like', '%'.$request->letter_no.'%');
    //     }
    //     if ($request->almirah) {
    //         // $query->where('row_no', 'Like', '%'.$request->letter_no.'%');
    //     }
    //     if ($request->row) {
    //         // $query->where('row_no', 'Like', '%'.$request->letter_no.'%');
    //     }

    //     if ($request->letter_no) {
    //         $query->where('letter_no', 'Like', '%'.$request->letter_no.'%');
    //     }

    
    //    if ($request->year) {
    //         $lastTwoDigits = substr($request->year, -2);

    //         $query->whereRaw(
    //             "RIGHT(SUBSTRING_INDEX(letter_no, '/', -1), 2) = ?",
    //             [$lastTwoDigits]
    //         );
    //     }                           


    //     $data = $query->paginate(50);

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
        

        $data = $query->where('lr.approved_rejected_by_sec','1')->whereNotNull('lrd.record_id')->paginate(10);

        return response()->json([
                    'status' => true,
                    'message' => 'Records Fetch successfully',
                    'data' =>  $data,
                ]);
    }
        public function getAllSendLetters(Request $request)
    {

    //  $user = Auth::user()->id;
    //         // dd($user);
    //       $userSubrole = Auth::user()->subrole->name; 
        
    //         $parentId = null;
    //         $parentId = Auth::user()->parent_user_id;
    //         // dd($parentId);
    //         if($parentId){

    //             $userParentData = User::with('role')->where('id',$parentId)->get();
    //             $roleParent = $userParentData[0]->role->name ?? '';
    //         }
    //         // dd($roleParent);
    //            $userParentSubrole = Auth::user()->userParentRole ?? '';  

    //     if ($userSubrole) {
    //     $query = DB::table('letters_record')
    //         //  ->leftJoin('letters_record_details as cd', 'letters_record.id', '=', 'cd.complain_id')
    //         ->leftJoin('letters_record_documents as dd', 'letters_record.id', '=', 'dd.record_id')
    //         ->leftJoin('letter_actions as rep', 'letters_record.id', '=', 'rep.record_id')
        
    //         ->select(
    //             'letters_record.*',
            

    //         );


    //     switch ($userSubrole) {
    //          case "ro":
    //            $query->where('approved_rejected_by_rk', 1)
    //                         ->where('approved_rejected_by_ro', 1)
    //                         // ->where('rep.status', 'Forwarded')
    //                                 // ->whereNotNull('rep.forward_to_sec')
    //                                  ->Orwhere('rep.forward_by_ro',$user);
    
    //             break;
    //         case "ro-aro":

    //                  $query->where('approved_rejected_by_rk', 1)
    //                         ->where('approved_rejected_by_ro_aro', 1)
    //                         // ->where('rep.status', 'Forwarded')
    //                                 // ->whereNotNull('rep.forward_to_sec')
    //                                  ->Orwhere('rep.forward_by_ro_aro',$user);

    //                 //   ->where('forward_so', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);

    //             break;

    //         case "sec":
    //         //    $query->where('form_status', 1)
    //         //           ->where('approved_rejected_by_ro', 1);
    //                 //    ->where('forward_to_lokayukt', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);
    //                 // $query->groupBy('rep.target_date');    
    //                         $query->where('approved_rejected_by_rk', 1)
    //                         ->where('approved_rejected_by_sec', 1)
    //                         // ->where('rep.status', 'Forwarded')
    //                                 // ->whereNotNull('rep.forward_to_sec')
    //                                  ->Orwhere('rep.forward_by_sec',$user);
    //                 //  $query->where('rep.type', 2)
    //                 //                 ->where('rep.status', 'Report Requested')
    //                 //                 ->whereNotNull('rep.forward_to_sec')
    //                 //                  ->where('rep.forward_to_sec',$user);

    //             break;
    //         case "so":
    //         //    $query->where('form_status', 1)
    //         //           ->where('approved_rejected_by_ro', 1);
    //                 //    ->where('forward_to_lokayukt', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);
    //                 // $query->groupBy('rep.target_date');    
    //                         $query->where('approved_rejected_by_rk', 1)
    //                         // ->where('approved_rejected_by_sec', 0);
    //                         // ->where('rep.status', 'Forwarded')
    //                                 // ->whereNotNull('rep.forward_to_sec')
    //                                  ->Orwhere('rep.forward_by_so',$user);
    //                 //  $query->where('rep.type', 2)
    //                 //                 ->where('rep.status', 'Report Requested')
    //                 //                 ->whereNotNull('rep.forward_to_sec')
    //                 //                  ->where('rep.forward_to_sec',$user);

    //             break;

    //               case "ds":
    //                 //    $query->where('form_status', 1)
    //                 //           ->where('approved_rejected_by_ro', 1);
    //                 //    ->where('forward_to_lokayukt', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);
    //                 // $query->groupBy('rep.target_date');    
    //                         $query->where('approved_rejected_by_ds', 1)
    //                         ->where('approved_rejected_by_ds', 1)
    //                         ->where('rep.status', 'Forwarded')
    //                                 ->whereNotNull('rep.forward_to_ds')
    //                                  ->where('rep.forward_to_ds',$user);
        
    //             break;
    //          case "js":
    //                 //    $query->where('form_status', 1)
    //                 //           ->where('approved_rejected_by_ro', 1);
    //                 //    ->where('forward_to_lokayukt', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);
    //                 // $query->groupBy('rep.target_date');    
    //                         $query->where('approved_rejected_by_js', 1)
    //                         // ->where('rep.status', 'Forwarded')
    //                         //         ->whereNotNull('rep.forward_to_js')
    //                                  ->where('rep.forward_by_js',$user);
                
    //             break;
    //             case "us":
    //                 //    $query->where('form_status', 1)
    //                 //           ->where('approved_rejected_by_ro', 1);
    //                 //    ->where('forward_to_lokayukt', 1)
    //                 //   ->whereOr('forward_to_uplokayukt', 1);
    //                 // $query->groupBy('rep.target_date');    
    //                         $query->where('approved_rejected_by_us', 1)
    //                         ->where('rep.status', 'Forwarded')
    //                                 ->whereNotNull('rep.forward_to_us')
    //                                  ->where('rep.forward_by_us',$user);
            
    //             break;


    //         case "cio-io":
    //              $query->where('letters_record.approved_rejected_by_cio_io','1')
    //                  ->where('rep.forward_by_cio_io',$user);
        
    //             break;

    //                case "io":
    //              $query->where('letters_record.approved_rejected_by_io','1')
    //                  ->where('rep.forward_by_io',$user);
        

    //             break;

    

    //         default:
    //             return response()->json([
    //                 'status' => false,
    //                 'message' => 'Invalid subrole',
    //                 'data' => [],
    //             ], 400);
    //     }

    //     // dd($query->toSql());

    //     $records = $query->distinct('letters_record.id')->orderBy('letters_record.updated_at', 'DESC')->get();

                


    //         return response()->json([
    //             'status' => true,
    //             'message' => 'Records fetched successfully',
    //             'data' => $records,
            
    //         ]);
        // }
        // $query = DB::table('letters_record as lr')
        // ->join('letters_record_documents as lrd','lr.id','lrd.record_id') ->select('lr.*');
        

        // $data = $query->where('lr.approved_rejected_by_sec','1')->paginate(10);

        //  return response()->json([
        //             'status' => true,
        //             'message' => 'Records Fetch successfully',
        //             'data' =>  $data,
        //         ]);

        $user = Auth::user()->id;
            // dd($user);
        $userSubrole = Auth::user()->subrole->name; 
        
            $parentId = null;
            $parentId = Auth::user()->parent_user_id;
            // dd($parentId);
            if($parentId){

                $userParentData = User::with('role')->where('id',$parentId)->get();
                $roleParent = $userParentData[0]->role->name ?? '';
            }
            // dd($roleParent);
            $userParentSubrole = Auth::user()->userParentRole ?? '';  

        if ($userSubrole) {
        $query = DB::table('letters_record')
            //  ->leftJoin('letters_record_details as cd', 'letters_record.id', '=', 'cd.complain_id')
            ->leftJoin('letters_record_documents as dd', 'letters_record.id', '=', 'dd.record_id')
            ->leftJoin('letter_actions as rep', 'letters_record.id', '=', 'rep.record_id')
        
            ->select(
                'letters_record.*',
            

            );


        switch ($userSubrole) {
            case "ro":
            $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_ro', $user)
                    ->where('approved_rejected_by_ro', 1)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_ro', 0); 
                        });

                    });

    
                break;
            case "ro-aro":

                $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_ro_aro', $user)
                    ->where('approved_rejected_by_ro_aro', 1)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_ro_aro', 0); 
                        });

                    });

                break;


            case "sec":

                $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_sec', 1);
                    // })

                    // ->orWhere('rep.forward_to_sec', $user)

                    // ->orWhere(function ($inner) use ($user) {
                    //     $inner->where('dd.added_by', $user)
                    //         ->where('approved_rejected_by_sec', 0); // 👈 yahan add kiya
                    // });

                    $q->where('rep.forward_by_sec', $user)
                    ->where('approved_rejected_by_sec', 1);

                });

            break;
            case "so":
                    $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_by_so', $user)
                    ->where('approved_rejected_by_so', 1);

                    // ->orWhere(function ($inner) use ($user) {
                    //     $inner->where('dd.added_by', $user)
                    //         ->where('approved_rejected_by_so', 0); 
                    //     });

                    });
                            // $query->where('approved_rejected_by_rk', 1)
                            // ->where('approved_rejected_by_so', 0)
                        
                            //          ->Orwhere('rep.forward_to_so',$user);
                

                break;

                case "ds":
                $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_ds', $user)
                    ->where('approved_rejected_by_ds', 1)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_ds', 0); 
                        });

                    });
                            // $query->where('approved_rejected_by_ds', 0)
                            // ->where('rep.status', 'Forwarded')
                            //         ->whereNotNull('rep.forward_to_ds')
                            //          ->where('rep.forward_to_ds',$user);
        
                break;
            case "js":
                $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_js', 0);
                    // })

                    $q->Where('rep.forward_to_js', $user)
                    ->where('approved_rejected_by_js', 1)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_js', 0); 
                        });

                    });
                            // $query->where('approved_rejected_by_js', 0)
                            // ->where('rep.status', 'Forwarded')
                            //         ->whereNotNull('rep.forward_to_js')
                            //          ->where('rep.forward_to_js',$user);
                
                break;
                case "us":
                        $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_us', $user)
                    ->where('approved_rejected_by_us', 1)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_us', 1); 
                        });

                    });
                            // $query->where('approved_rejected_by_us', 0)
                            // ->where('rep.status', 'Forwarded')
                            //         ->whereNotNull('rep.forward_to_us')
                            //          ->where('rep.forward_to_us',$user);
            
                break;


            case "cio-io":

                $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_cio_io', $user)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_cio_io', 0); 
                        });

                    });
                //  $query->where('letters_record.approved_rejected_by_cio_io','0')
                //      ->where('rep.forward_to_cio_io',$user);
        
                break;

                case "io":

                    $query->where(function ($q) use ($user) {
                    
                    // $q->where(function ($inner) {
                    //     $inner->where('approved_rejected_by_rk', 1)
                    //         ->where('approved_rejected_by_us', 0);
                    // })

                    $q->where('rep.forward_to_io', $user)

                    ->orWhere(function ($inner) use ($user) {
                        $inner->where('dd.added_by', $user)
                            ->where('approved_rejected_by_io', 0); 
                        });

                    });
                //  $query->where('letters_record.approved_rejected_by_io','0')
                //      ->where('rep.forward_to_io',$user);
        

                break;

    

            default:
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid subrole',
                    'data' => [],
                ], 400);
        }

    

        $records = $query->distinct('letters_record.id')
                            ->orderBy('letters_record.updated_at', 'DESC')
                            ->get();

                


            return response()->json([
                'status' => true,
                'message' => 'Records fetched successfully',
                'data' => $records,
            
            ]);
        }
    }

        public function approvedLetterByRk(Request $request,$id){
            $userId = Auth::user()->id;
            if(isset($id) && $request->isMethod('post')){

                    $apc = LetterRecords::findOrFail($id);
                    $apc->approved_rejected_by_sec = 1;
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

        public function forwardLetterBySec(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_sec = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_sec = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                                switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByus(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_us = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_us = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByjs(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_js = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_js = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                                switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByds(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_ds = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_ds = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByso(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_so = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_so = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                                switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByro(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_ro = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_ro = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                                switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }
        public function forwardLetterByro_aro(Request $request,$complainId){
            //    dd($complainId);
            // $user = Auth::user()->id;
            // dd($usersubrole);

            $userRole = User::with('role')->where('id',$request->forward_to)->get();

            
                $roleFwd = $userRole[0]->role->name ?? null;
            // dd($roleFwd);
            
            $user = User::with('role','subrole')->where('id',$request->forward_to)->get();
                $subroleFwd = '';
                
                $subroleFwd = $user[0]->subrole->name ?? null;

        
    

            $userId = Auth::user()->id;
            // $userOtp = Auth::user()->otp;

            $validation = Validator::make($request->all(), [
                // 'forward_by_ds_js' => 'required|exists:users,id',
                'forward_to' => 'required|exists:users,id',
                //  'otp' => 'required|numeric',
                // 'remark' => 'required',
            
            
            ], [
                // 'forward_by_ds_js.required' => 'Forward by Supervisor is required.',
                // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
                'forward_to.required' => 'Forward to user is required.',
                'forward_to.exists' => 'Forward to user does not exist.',
                //   'otp.required' => 'OTP is required.',
                // 'remark.required' => 'Remark is required.',
            
            ]);

            // $validation->after(function ($validator) use ($request, $userOtp) {
            //     if ($request->otp != $userOtp) {
            //         $validator->errors()->add('otp', 'Invalid OTP');
            //     }
            // });
            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }
            // if(isset($complainId) && $request->isMethod('post')){
            if(isset($complainId) && $request->isMethod('post')){
            

                //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
                // dd($user[0]->role->name);
                // $roleFwd = $userRole[0]->role->name;

                
                $cmp =  LetterRecords::findOrFail($complainId);
                // dd($cmp);

                if($cmp){
                    $cmp->approved_rejected_by_ro_aro = 1;
                    // $cmp->forward_to_d_a = $request->forward_to_d_a;
                    // $remark ='Remark By Deputy Secretary / Joint Secretary';
                    // $remark.='\n';
                    // $remark.= $request->remarks;
                    // $remark.='\n';
                    // $cmp->remark = $remark;
                    
                        if($cmp->save()){

                            //  $apcAction = new LetterAction();
                            //     $apcAction->target_date = $request->target_date;
                            //     $apcAction->assigned_date = $request->assigned_date;
                    
                            $apcAction = new LetterAction();
                            $apcAction->record_id = $complainId;
                            $apcAction->forward_by_ro_aro = $userId;
                            // $apcAction->approved_rejected_by_ro_aro = $userId;

                            if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

                                if ($roleFwd === 'lok-ayukt') {
                                    $apcAction->forward_to_lokayukt = $request->forward_to;
                                } else if($roleFwd === 'up-lok-ayukt') {
                                    $apcAction->forward_to_uplokayukt = $request->forward_to;
                                }else{
                                    $apcAction->forward_to_ps = $request->forward_to;
                                }

                            } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                            switch ($subroleFwd) {
                                    case 'ds':
                                        $apcAction->forward_to_ds = $request->forward_to;
                                        $cmp->approved_rejected_by_ds = 0;
                                        $cmp->save();
                                        break;
                                    case 'js':
                                        $apcAction->forward_to_js = $request->forward_to;
                                        $cmp->approved_rejected_by_js = 0;
                                        $cmp->save();
                                        break;
                                    case 'us':
                                        $apcAction->forward_to_us = $request->forward_to;
                                        $cmp->approved_rejected_by_us = 0;
                                        $cmp->save();
                                        break;
                                    case 'sec':
                                        $apcAction->forward_to_sec = $request->forward_to;
                                        $cmp->approved_rejected_by_sec = 0;
                                        $cmp->save();
                                        break;

                                    case 'cio-io':
                                        $apcAction->forward_to_cio_io = $request->forward_to;
                                        $cmp->approved_rejected_by_cio_io = 0;
                                        $cmp->save();
                                        break;

                                    case 'so':
                                        $apcAction->forward_to_so = $request->forward_to;
                                        $cmp->approved_rejected_by_so = 0;
                                        $cmp->save();
                                        break;
                                
                                        case 'ro-aro':
                                        $apcAction->forward_to_ro_aro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro_aro = 0;
                                        $cmp->save();
                                        break;
                                        case 'ro':
                                        $apcAction->forward_to_ro = $request->forward_to;
                                        $cmp->approved_rejected_by_ro = 0;
                                        $cmp->save();
                                        break;
                                }
                            }

                            if($request->sent_through_rk == 1){
                                $apcAction->sent_through_rk = 1;
                                $apcAction->sent_through_rk_id = $cmp->added_by;
                            }

                            $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            $apcAction->remarks = $request->remark;
                            $apcAction->save();


                            // $apcAction = new ComplaintAction();
                            // $apcAction->complaint_id = $complainId;
                            // $apcAction->forward_by_ps = $userId;

                            // $apcAction->forward_to_lokayukt = $request->forward_to;
                        
                            // $apcAction->status = 'Forwarded';
                            // $apcAction->type = '1';
                            // $apcAction->remarks = $request->remark;
                            // $apcAction->save();
                        }
                    
                    }
                return response()->json([
                        'status' => true,
                        'message' => 'Forwarded Successfully',
                        'data' => $cmp
                    ], 200);
                
                // else{
                //         return response()->json([
                //         'status' => false,
                //         'errors' => 'OTP not verified'
                //     ], 422);
                // }
            
            }else{
                
                return response()->json([
                        'status' => false,
                        'message' => 'Please check Id'
                    ], 401);
            }

        }

    //     public function getUsers()
    // {
    //     $userId = Auth::user()->id;
    //     $usersByRole = User::with('role','subRole')
    //         ->whereHas('role') // ensures role exists
    //         ->where('id','<>',$userId)
    //         ->get()
    //         ->groupBy(function ($user) {
    //             return $user->role->name;
    //         });

    //     if (!empty($usersByRole['lok-ayukt'])) {

    //         $data = [];
    //         $data[] = $usersByRole['lok-ayukt'] ?? [];
    //         $data[] = $usersByRole['up-lok-ayukt'] ?? [];
    //         $data[] = $usersByRole['ps'] ?? [];
    //         $data[] = $usersByRole['supervisor'] ?? [];

    //         return response()->json($data);
    //     } else {
    //         return response()->json(["message" => "Data Not Found"]);
    //     }
    // }

    // public function getUsers()
    // {
    //     $userId = Auth::user()->id;

    //     $users = User::with('role','subRole')
    //         ->whereHas('role')
    //         ->where('id','<>',$userId)
    //         ->get();

    //     $usersByRole = $users->groupBy('role.name');

    //     if ($usersByRole->isNotEmpty()) {

    //         return response()->json([
    //             'lok-ayukt' => $usersByRole['lok-ayukt'] ?? [],
    //             'up-lok-ayukt' => $usersByRole['up-lok-ayukt'] ?? [],
    //             'ps' => $usersByRole['ps'] ?? [],
    //             'supervisor' => $usersByRole['supervisor'] ?? [],
    //         ]);
    //     }

    //     return response()->json(["message" => "Data Not Found"]);
    // }

    public function getUsers()
        {
            $userId = Auth::user()->id;
            $usersByRole = User::with('role', 'subRole')
                ->whereHas('role') // ensures role exists
                ->where('id', '<>', $userId)
                ->get()
                ->groupBy(function ($user) {
                    return $user->role->name;
                });

            if (!empty($usersByRole['lok-ayukt'])) {

                $data = [];
                $data[] = $usersByRole['lok-ayukt'] ?? [];
                $data[] = $usersByRole['up-lok-ayukt'] ?? [];
                $data[] = $usersByRole['ps'] ?? [];
                $data[] = $usersByRole['aps'] ?? [];
                $data[] = $usersByRole['supervisor'] ?? [];

                return response()->json($data);
            } else {
                return response()->json(["message" => "Data Not Found"]);
            }
        }


    public function addNotes(Request $request)
        {
        
            // $user = $request->user()->id;
            $added_by = Auth::user()->id;
        
            $validation = Validator::make($request->all(), [
                
                'record_id' => 'required|numeric',
                // 'type' => 'required|string',
                // 'title' => 'required|string',
                'description' => 'required|string',
                // 'd_id' => 'required',
                // 'forward_by' => 'required',
                // 'forward_to' => 'required',
                // 'range_from' => 'required',
                // 'range_two' => 'required',
                
            ], [
                'record_id.required' => 'Complaint Id is required.',
                // 'type.required' => 'Complaint description is required.',
                // 'title.required' => 'Letter Subject is Required',
                'description.required' => 'Description is Required',
                // 'd_id.required' => 'Document is Required',
                'range_from.required' => 'Range From is Required',
                'range_two.required' => 'Range too is Required',
            ]);

            if ($validation->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validation->errors()
                ], 422);
            }

            if(isset($request->record_id)){    
                    $compDoc = new LetterNotes();
                    $compDoc->record_id = $request->record_id;
                    $compDoc->added_by = $added_by;
                    // $compDoc->type = $request->type;
                    // $compDoc->title = $request->title;
                    $compDoc->description = $request->description;
                    $compDoc->forward_by = $added_by;
                    $compDoc->forward_to = $request->forward_to;
                    $compDoc->d_id = $request->d_id;
                    $compDoc->range_from = $request->range_from;
                    $compDoc->range_two = $request->range_two;
                    $compDoc->save();
                
                    return response()->json([
                        'status' => true,
                        'message' => 'Notes Added successfully.',
                        'data' => $compDoc
                    ], 201);
            }

        }

        public function getNotes(Request $request,$id){
            if($request->isMethod('get')){
                // $Notes = ComplaintNotes::where('complaint_id',$id)
                // ->get();

                $Notes = LetterNotes::where('record_id', $id)
                ->leftJoin('users', 'letter_notes.forward_by', '=', 'users.id') // Left Join with users table
                ->select('letter_notes.*', 'users.name as forwarded_by_name', 'users.email as forwarded_by_email') // You can select any fields you want
                ->orderBy('id','desc')
                ->get();

    
            return response()->json([
                        'status' => true,
                        'message' => 'Notes Fetch successfully.',
                        'data' => $Notes
                    ], 200);
            }
        
        }


}
