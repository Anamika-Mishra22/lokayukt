<?php

namespace App\Http\Controllers\api\Employee;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\ComplainActionPersonalFile;
use App\Models\EmployeeFilePermission;
use Illuminate\Http\Request;
use App\Models\EmployeeFiles;
use App\Models\EmployeeUploadFiles;
use App\Models\User;
use App\Models\RTIActionFile;
use App\Models\RtiFilePermission;
use Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmployeesController extends Controller
{
    public function index()
    {
        // dd("lok0");
        $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('added_by', $user)
        ->where('type', 'Letter')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }


     public function fileDetails($id)
    {
        // dd("lok0");
        // $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('id',$id)
        // ->where('type', 'Letter')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }


     public function viewPersonalFile()
    {
        // dd("lok0");
        $user = Auth::user()->id;
        $empfiles = EmployeeUploadFiles::where('added_by', $user)
        ->where('type', 'Personal File')
        ->get();
        // dd($empfiles->toArray());
        return ApiResponse::generateResponse('success', 'Records fetch successfully', $empfiles);
    }

    public function fetch_topics()
    {

        $topics = Topics::get();
        // dd($topics->toArray());
        return ApiResponse::generateResponse('success', 'Topics fetch successfully', $topics);
    }
    public function fetch_fileType()
    {

        $fileType = EmployeeFiles::get();
        // dd($fileType->toArray());
        return ApiResponse::generateResponse('success', 'Files fetch successfully', $fileType);
    }

    public function uploadFiles(Request $request)
    {
        $added_by = Auth::user()->id;
        $parentId = Auth::user()->parent_user_id ?? null;


        $validation = Validator::make($request->all(), [

            // 'complain_id' => 'required|numeric',
            'title'       => 'required|string',
            'type'        => 'required|string',

            // Multiple file validation
            'file'        => 'required|array',
            'file.*'      => 'file|mimes:jpg,jpeg,png,pdf|max:2048',

        ], [

            // 'complain_id.required' => 'Complaint Id is required.',
            'title.required'       => 'Letter Subject is Required.',
            'type.required'        => 'Complaint description is required.',
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

                $filePath = $uploadedFile->storeAs('employeeFiles', $fileName, 'public');

                $compDoc = new EmployeeUploadFiles();
                $compDoc->added_by   = $added_by;
                 $compDoc->parent_id  = $parentId; 
                $compDoc->type       = "Letter";
                $compDoc->title      = $request->title;
                $compDoc->file       = $fileName;

                $compDoc->save();

                $uploadedFiles[] = $compDoc;
            }

            return response()->json([
                'status'  => true,
                'message' => 'Files uploaded successfully.',
                'data'    => $uploadedFiles
            ], 201);
        }

        return response()->json([
            'status' => false,
            'message' => 'No files found.'
        ], 400);
    }



    public function uploadRTIFiles(Request $request)
{
    $user = Auth::user();
    $added_by = $user->id;

    $validation = Validator::make($request->all(), [
        'title'  => 'required|string',
        'type'   => 'required|string',
        'file'   => 'required|array',
        'file.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        // 'person_user_id'=>'required|numeric'
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validation->errors()
        ], 422);
    }

    $uploadedFiles = [];

    foreach ($request->file('file') as $uploadedFile) {

        $fileName = 'doc_' . uniqid() . '.' . $uploadedFile->getClientOriginalExtension();
        $uploadedFile->storeAs('employeeFiles', $fileName, 'public');

        $file = EmployeeUploadFiles::create([
            'added_by' => $added_by,
            'type'     => $request->type,
            'title'    => $request->title,
            'file'     => $fileName,
            'permission_user_id' => $added_by,
            'is_forward' => 0,
            // 'person_user_id'=>$request->person_user_id
        ]);

        // ComplainActionPersonalFile::create([
        //     'file_id'      => $file->id,
        //     'subject'      => $request->title,
        //     'remarks'      => 'File Uploaded',
        //     'action_date'  => now(),
        //     'type'         => 1,
        //     'status'       => 'Verified',
        //     'uploaded_by_admin' => $added_by
        // ]);

        $uploadedFiles[] = $file;
    }

    return response()->json([
        'status'  => true,
        'message' => 'Files uploaded successfully with tracking.',
        'data'    => $uploadedFiles
    ], 201);
}
    public function uploadPrivateFiles(Request $request)
{
    $user = Auth::user();
    $added_by = $user->id;

    $validation = Validator::make($request->all(), [
        'title'  => 'required|string',
        'type'   => 'required|string',
        'file'   => 'required|array',
        'file.*' => 'file|mimes:jpg,jpeg,png,pdf|max:2048',
        // 'person_user_id'=>'required|numeric'
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validation->errors()
        ], 422);
    }

    $uploadedFiles = [];

    foreach ($request->file('file') as $uploadedFile) {

        $fileName = 'doc_' . uniqid() . '.' . $uploadedFile->getClientOriginalExtension();
        $uploadedFile->storeAs('employeeFiles', $fileName, 'public');

        $file = EmployeeUploadFiles::create([
            'added_by' => $added_by,
            'type'     => "Personal File",
            'title'    => $request->title,
            'file'     => $fileName,
            'permission_user_id' => $added_by,
            'is_forward' => 0,
            // 'person_user_id'=>$request->person_user_id
        ]);

        // ComplainActionPersonalFile::create([
        //     'file_id'      => $file->id,
        //     'subject'      => $request->title,
        //     'remarks'      => 'File Uploaded',
        //     'action_date'  => now(),
        //     'type'         => 1,
        //     'status'       => 'Verified',
        //     'uploaded_by_admin' => $added_by
        // ]);

        $uploadedFiles[] = $file;
    }

    return response()->json([
        'status'  => true,
        'message' => 'Files uploaded successfully with tracking.',
        'data'    => $uploadedFiles
    ], 201);
}

public function addAuthoritytoPerFile(){
    
}



public function privateFilesPermissionById($id)
{

    $users = User::where('users.role_id', 3) 
        ->leftJoin('employee_file_permissions as p', function($join) use ($id){
            $join->on('users.id', '=', 'p.user_id')
                 ->where('p.file_id', $id);
        })
        ->select(
            'users.id',
            'users.name',
            'users.role_id',
            DB::raw('IFNULL(p.can_view,0) as can_view'),
            DB::raw('IFNULL(p.can_edit,0) as can_edit')
        )
        ->get();

    return response()->json([
        'status' => true,
        'message' => 'File permission list fetched successfully',
        'data' => $users
    ]);
}



    public function getFilePreview($id)
    {

        $cmpDetail = EmployeeUploadFiles::findOrFail($id);

        // Correct path
        $path = Storage::url('employeeFiles/' . $cmpDetail->file);

        $cmpDetail->filepath = $path;

        return response()->json([
            'status' => true,
            'message' => 'File Fetch successfully',
            'data' => $path,
        ]);
    }



    public function giveFilePermission(Request $request)
{
    $request->validate([
        'file_id' => 'required|integer|exists:employee_files,id',
        'permissions' => 'required|array',
        'permissions.*.user_id' => 'required|integer|exists:users,id',
        'permissions.*.view' => 'required|boolean',
        'permissions.*.edit' => 'required|boolean',
    ]);

    $adminId = Auth::id();

    foreach($request->permissions as $perm){

        EmployeeFilePermission::updateOrCreate(
            [
                'file_id' => $request->file_id,
                'user_id' => $perm['user_id']
            ],
            [
                'can_view' => $perm['view'],
                'can_edit' => $perm['edit'],
                'given_by' => $adminId
            ]
        );
    }

    return response()->json([
        'status' => true,
        'message' => 'Permissions assigned successfully'
    ]);
}
    public function giveFilePermissionRti(Request $request)
{
    $request->validate([
        'file_id' => 'required|integer|exists:employee_files,id',
        'permissions' => 'required|array',
        'permissions.*.user_id' => 'required|integer|exists:users,id',
        'permissions.*.view' => 'required|boolean',
        'permissions.*.edit' => 'required|boolean',
    ]);

    $adminId = Auth::id();

    foreach($request->permissions as $perm){

        RtiFilePermission::updateOrCreate(
            [
                'file_id' => $request->file_id,
                'user_id' => $perm['user_id']
            ],
            [
                'can_view' => $perm['view'],
                'can_edit' => $perm['edit'],
                'given_by' => $adminId
            ]
        );
    }

    return response()->json([
        'status' => true,
        'message' => 'Permissions assigned successfully'
    ]);
}
//  public function personalFileList()
// {
//     $userId = auth()->id();

//     $files = EmployeeUploadFiles::whereHas('permissions', function($q) use ($userId){
//             $q->where('user_id', $userId)
//               ->where('can_view', 1);
//         })
//         ->get();

//     return ApiResponse::generateResponse(
//         'success',
//         'Employee personal files fetched successfully',
//         $files,
//         200
//     );
// }

public function personalFileList()
{
    $userId = auth()->id();

    $files = EmployeeUploadFiles::where(function($q) use ($userId) {

        $q->where(function($q1) use ($userId) {
            $q1->where('person_user_id', $userId)
            ->where('is_forward', 0)
            ->whereHas('permissions', function($q2) use ($userId) {
                $q2->where('user_id', $userId)
                    ->where('can_view', 1);
            });
        });

        $q->orWhere(function($p) use ($userId) {
            $p->where('is_forward', 0) 
              ->whereHas('permissions', function($q2) use ($userId) {
                  $q2->where('user_id', $userId)
                     ->where('can_view', 1);
              });
        });

        $q->orWhere(function($f) use ($userId) {
           $f->where('is_forward', 1)
  ->where('added_by', '!=', $userId) 
  ->where(function($q2) use ($userId) {
      $q2->where('permission_user_id', $userId)
         ->orWhere('user_id', $userId);
  });
        });

    })
    ->with(['permissions' => function($q) use ($userId) {
        $q->where('user_id', $userId);
    }])
    ->get();

    foreach ($files as $file) {
        $canView = 0;
        $canEdit = 0;

        if ($file->person_user_id == $userId || $file->added_by == $userId) {
            $canView = 1;
            $canEdit = 1;
        } elseif ($file->permissions->first()) {
            $canView = $file->permissions->first()->can_view;
            $canEdit = $file->permissions->first()->can_edit;
        }

        $file->can_view = $canView;
        $file->can_edit = $canEdit;
    }

    return ApiResponse::generateResponse(
        'success',
        'Employee personal files fetched successfully',
        $files,
        200
    );
}
public function personalFileIds()
{
    $userId = auth()->id();

    $fileIds = EmployeeUploadFiles::where(function($q) use ($userId) {

        $q->where(function($q1) use ($userId) {
            $q1->where('person_user_id', $userId)
               ->where('is_forward', 0)
               ->whereHas('permissions', function($q2) use ($userId) {
                   $q2->where('user_id', $userId)
                      ->where('can_view', 1);
               });
        });

        $q->orWhere(function($p) use ($userId) {
            $p->where('is_forward', 0)
              ->whereHas('permissions', function($q2) use ($userId) {
                  $q2->where('user_id', $userId)
                     ->where('can_view', 1);
              });
        });

        $q->orWhere(function($f) use ($userId) {
            $f->where('is_forward', 1)
              ->where('added_by', '!=', $userId)
              ->where(function($q2) use ($userId) {
                  $q2->where('permission_user_id', $userId)
                     ->orWhere('user_id', $userId);
              });
        });

    })
    ->pluck('title','id');

    return ApiResponse::generateResponse(
        'success',
        'Employee personal file ids fetched successfully',
        $fileIds,
        200
    );
}
public function rtiFileIds()
{
    $userId = auth()->id();

    $fileIds = EmployeeUploadFiles::where(function($q) use ($userId) {

        $q->where(function($q1) use ($userId) {
            $q1->where('person_user_id', $userId)
               ->where('is_forward', 0)
               ->whereHas('permissions', function($q2) use ($userId) {
                   $q2->where('user_id', $userId)
                      ->where('can_view', 1);
               });
        });

        $q->orWhere(function($p) use ($userId) {
            $p->where('is_forward', 0)
              ->whereHas('permissions', function($q2) use ($userId) {
                  $q2->where('user_id', $userId)
                     ->where('can_view', 1);
              });
        });

        $q->orWhere(function($f) use ($userId) {
            $f->where('is_forward', 1)
              ->where('added_by', '!=', $userId)
              ->where(function($q2) use ($userId) {
                  $q2->where('permission_user_id', $userId)
                     ->orWhere('user_id', $userId);
              });
        });

    })
    ->pluck('title','id');

    return ApiResponse::generateResponse(
        'success',
        'Employee RTI file ids fetched successfully',
        $fileIds,
        200
    );
}
public function rtiFileList()
{
    $userId = auth()->id();

    $files = EmployeeUploadFiles::where(function($q) use ($userId) {

        $q->where(function($q1) use ($userId) {
            $q1->where('person_user_id', $userId)
   ->where('is_forward', 0)
   ->whereHas('permissions', function($q2) use ($userId) {
       $q2->where('user_id', $userId)
          ->where('can_view', 1);
   });
        });

        $q->orWhere(function($p) use ($userId) {
            $p->where('is_forward', 0) 
              ->whereHas('permissions', function($q2) use ($userId) {
                  $q2->where('user_id', $userId)
                     ->where('can_view', 1);
              });
        });

        $q->orWhere(function($f) use ($userId) {
           $f->where('is_forward', 1)
  ->where('added_by', '!=', $userId) 
  ->where(function($q2) use ($userId) {
      $q2->where('permission_user_id', $userId)
         ->orWhere('user_id', $userId);
  });
        });

    })
    ->with(['permissions' => function($q) use ($userId) {
        $q->where('user_id', $userId);
    }])
    ->get();

    foreach ($files as $file) {
        $canView = 0;
        $canEdit = 0;

        if ($file->person_user_id == $userId || $file->added_by == $userId) {
            $canView = 1;
            $canEdit = 1;
        } elseif ($file->permissions->first()) {
            $canView = $file->permissions->first()->can_view;
            $canEdit = $file->permissions->first()->can_edit;
        }

        $file->can_view = $canView;
        $file->can_edit = $canEdit;
    }

    return ApiResponse::generateResponse(
        'success',
        'RTI files fetched successfully',
        $files,
        200
    );
}


public function personalFileListById($id)
{
    $userId = auth()->id();

   $file = EmployeeUploadFiles::where('id', $id)
    ->where(function($q) use ($userId) {

        // 1. Admin / uploader
        $q->where('added_by', $userId);

        // 2. Permission based access
        $q->orWhere(function($p) use ($userId){
            $p->whereHas('permissions', function($p2) use ($userId){
                $p2->where('user_id', $userId)
                   ->where('can_view', 1);
            });
        });

        // 3. Forwarded users (NO permission check)
        $q->orWhere(function($f) use ($userId){
            $f->where('is_forward', 1)
              ->where(function($q2) use ($userId){
                  $q2->where('permission_user_id', $userId)
                     ->orWhere('user_id', $userId);
              });
        });

    })
    ->with(['permissions' => function($q) use ($userId){
        $q->where('user_id', $userId);
    }])
    ->first();

        
        $actions = DB::table('complain_action_personal_files')
            ->where('file_id', $id)
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
        $file->actions = $actions;


    if (!$file) {
        return ApiResponse::generateResponse(
            'error',
            'File not found or you do not have permission to view it',
            null,
            404
        );
    }

    // Default permissions
    $canView = 0;
    $canEdit = 0;

    if ($file->added_by == $userId) {
        // Admin uploader full rights
        $canView = 1;
        $canEdit = 1;
    } elseif ($file->permissions->first()) {
        $canView = $file->permissions->first()->can_view;
        $canEdit = $file->permissions->first()->can_edit;
    }

    $file->can_view = $canView;
    $file->can_edit = $canEdit;

    return ApiResponse::generateResponse(
        'success',
        'Employee personal file details fetched successfully',
        $file,
        200
    );
}
public function rtiFileListById($id)
{
    $userId = auth()->id();

   $file = EmployeeUploadFiles::where('id', $id)
    ->where(function($q) use ($userId) {

        // 1. Admin / uploader
        $q->where('added_by', $userId);

        // 2. Permission based access
        $q->orWhere(function($p) use ($userId){
            $p->whereHas('permissions', function($p2) use ($userId){
                $p2->where('user_id', $userId)
                   ->where('can_view', 1);
            });
        });

        // 3. Forwarded users (NO permission check)
        $q->orWhere(function($f) use ($userId){
            $f->where('is_forward', 1)
              ->where(function($q2) use ($userId){
                  $q2->where('permission_user_id', $userId)
                     ->orWhere('user_id', $userId);
              });
        });

    })
    ->with(['permissions' => function($q) use ($userId){
        $q->where('user_id', $userId);
    }])
    ->first();

        
        $actions = DB::table('complain_action_personal_files')
            ->where('file_id', $id)
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
        $file->actions = $actions;


    if (!$file) {
        return ApiResponse::generateResponse(
            'error',
            'File not found or you do not have permission to view it',
            null,
            404
        );
    }

    // Default permissions
    $canView = 0;
    $canEdit = 0;

    if ($file->added_by == $userId) {
        // Admin uploader full rights
        $canView = 1;
        $canEdit = 1;
    } elseif ($file->permissions->first()) {
        $canView = $file->permissions->first()->can_view;
        $canEdit = $file->permissions->first()->can_edit;
    }

    $file->can_view = $canView;
    $file->can_edit = $canEdit;

    return ApiResponse::generateResponse(
        'success',
        'RTI file details fetched successfully',
        $file,
        200
    );
}

    public function sendPersonalFile(Request $request)
    {
        $request->validate([
            'file_id' => 'required|exists:employee_files,id',
            'to_user_id' => 'required|exists:users,id',
            'action_date' => 'nullable|date',
            'remark' => 'nullable|string'
        ]);

        // Step 1: File uthao
        $file = EmployeeUploadFiles::find($request->file_id);
        if (!$file) {
            return response()->json([
                'status' => false,
                'message' => 'File not found'
            ], 404);
        }

        $fromUserId = $file->permission_user_id ?? $file->added_by;

        $toUser = User::with(['role', 'subrole'])->find($request->to_user_id);
        if (!$toUser) {
            return response()->json([
                'status' => false,
                'message' => 'Recipient user not found'
            ], 404);
        }

        $data = [
            'file_id' => $file->id,
            'subject' => $file->title ?? null,
            'remarks' => $request->remark,
            'action_date' => $request->action_date ?? now(),
            'type' => 1,
            'status' => 'Forwarded',
        ];

        if ($toUser->role->name == 'supervisor') {
            $data['forward_to_rk'] = $toUser->id;
            $data['forward_by_rk'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'cio-io') {
            $data['forward_to_cio_io'] = $toUser->id;
            $data['forward_by_cio_io'] = $fromUserId;
        } elseif ($toUser->role->name == 'ro') {
            $data['forward_to_ro'] = $toUser->id;
            $data['forward_by_ro'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'ds') {
            $data['forward_to_ds'] = $toUser->id;
            $data['forward_by_ds'] = $fromUserId;
        }

        $history = ComplainActionPersonalFile::create($data);

        $file->permission_user_id = $toUser->id;
        $file->is_forward = 1;
        $file->save();

        return response()->json([
            'status' => true,
            'message' => 'File forwarded successfully',
            'data' => [
                'history' => $history,
                'to_user' => [
                    'id' => $toUser->id,
                    'name' => $toUser->name,
                    'role' => $toUser->role->name ?? null,
                    'subrole' => $toUser->subrole->name ?? null
                ]
            ]
        ]);
    }
    public function sendRtiFile(Request $request)
    {
        $request->validate([
            'file_id' => 'required|exists:employee_files,id',
            'to_user_id' => 'required|exists:users,id',
            'action_date' => 'nullable|date',
            'remark' => 'nullable|string'
        ]);

        // Step 1: File uthao
        $file = EmployeeUploadFiles::find($request->file_id);
        if (!$file) {
            return response()->json([
                'status' => false,
                'message' => 'File not found'
            ], 404);
        }

        $fromUserId = $file->permission_user_id ?? $file->added_by;

        $toUser = User::with(['role', 'subrole'])->find($request->to_user_id);
        if (!$toUser) {
            return response()->json([
                'status' => false,
                'message' => 'Recipient user not found'
            ], 404);
        }

        $data = [
            'file_id' => $file->id,
            'subject' => $file->title ?? null,
            'remarks' => $request->remark,
            'action_date' => $request->action_date ?? now(),
            'type' => 1,
            'status' => 'Forwarded',
        ];

        if ($toUser->role->name == 'supervisor') {
            $data['forward_to_rk'] = $toUser->id;
            $data['forward_by_rk'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'cio-io') {
            $data['forward_to_cio_io'] = $toUser->id;
            $data['forward_by_cio_io'] = $fromUserId;
        } elseif ($toUser->role->name == 'ro') {
            $data['forward_to_ro'] = $toUser->id;
            $data['forward_by_ro'] = $fromUserId;
        } elseif ($toUser->subrole->name == 'ds') {
            $data['forward_to_ds'] = $toUser->id;
            $data['forward_by_ds'] = $fromUserId;
        }

        $history = RTIActionFile::create($data);

        $file->permission_user_id = $toUser->id;
        $file->is_forward = 1;
        $file->save();

        return response()->json([
            'status' => true,
            'message' => 'File forwarded successfully',
            'data' => [
                'history' => $history,
                'to_user' => [
                    'id' => $toUser->id,
                    'name' => $toUser->name,
                    'role' => $toUser->role->name ?? null,
                    'subrole' => $toUser->subrole->name ?? null
                ]
            ]
        ]);
    }

    // public function forwardPersonalFile(Request $request){
    //     //    dd($request->all());
    //     // $user = Auth::user()->id;
    //     // dd($usersubrole);

    //     $userId = Auth::user()->id;
    //     $AuthuserRole = User::with('role')->where('id',$userId)->get();
    //     $AuthroleFwd = $AuthuserRole[0]->role->name ?? null;
    //     $Authuser = User::with('role','subrole')->where('id',$request->to_user_id)->get();
    //     $AuthsubroleFwd = '';    
    //     $AuthsubroleFwd = $Authuser[0]->subrole->name ?? null;
        
    //     $userRole = User::with('role')->where('id',$request->to_user_id)->get();
    //     $roleFwd = $userRole[0]->role->name ?? null;
    //     $user = User::with('role','subrole')->where('id',$request->to_user_id)->get();
    //     $subroleFwd = '';    
    //     $subroleFwd = $user[0]->subrole->name ?? null;

       
 

        
    //     // $userOtp = Auth::user()->otp;

    //     $validation = Validator::make($request->all(), [
    //         // 'forward_by_ds_js' => 'required|exists:users,id',
    //         'file_id' => 'required',
    //         'to_user_id' => 'required|exists:users,id',
    //         //  'otp' => 'required|numeric',
    //         // 'remark' => 'required',
         
          
    //     ], [
    //         'file_id.required' => 'File Id is required.',
    //         // 'forward_by_ds_js.exists' => 'Forward by user does not exist.',
    //         'to_user_id.required' => 'Forward to user is required.',
    //         'to_user_id.exists' => 'Forward to user does not exist.',
    //         //   'otp.required' => 'OTP is required.',
    //         // 'remark.required' => 'Remark is required.',
           
    //     ]);

    //     // $validation->after(function ($validator) use ($request, $userOtp) {
    //     //     if ($request->otp != $userOtp) {
    //     //         $validator->errors()->add('otp', 'Invalid OTP');
    //     //     }
    //     // });
    //     if ($validation->fails()) {
    //         return response()->json([
    //             'status' => false,
    //             'errors' => $validation->errors()
    //         ], 422);
    //     }
    //     // if(isset($complainId) && $request->isMethod('post')){
    //      if(isset($request->file_id) && $request->isMethod('post')){
          

    //         //  $userRole = User::with('role')->where('id',$request->forward_to)->get();
    //         // dd($user[0]->role->name);
    //         // $roleFwd = $userRole[0]->role->name;

              
    //         $cmp =  EmployeeUploadFiles::findOrFail($request->file_id);
    //         // dd($cmp);

    //            if($cmp){
    //             $cmp->permission_user_id = $request->to_user_id;
    //             // $cmp->forward_to_d_a = $request->forward_to_d_a;
    //             // $remark ='Remark By Deputy Secretary / Joint Secretary';
    //             // $remark.='\n';
    //             // $remark.= $request->remarks;
    //             // $remark.='\n';
    //             // $cmp->remark = $remark;
                
    //                 if($cmp->save()){

    //                     $apcAction = new ComplainActionPersonalFile();
    //                     $apcAction->file_id = $request->file_id;
    //                     $apcAction->forward_by_cio_io = $userId;
    //                     // $apcAction->approved_rejected_by_ro_aro = $userId;

    //                     if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps'])) {

    //                         if ($roleFwd === 'lok-ayukt') {
    //                             $apcAction->forward_to_lokayukt = $request->to_user_id;
    //                         } else if($roleFwd === 'up-lok-ayukt') {
    //                             $apcAction->forward_to_uplokayukt = $request->to_user_id;
    //                         }else{
    //                              $apcAction->forward_to_ps = $request->to_user_id;
    //                         }

    //                     } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

    //                         switch ($subroleFwd) {
    //                              case 'ds':
    //                                 $apcAction->forward_to_ds = $request->to_user_id;
    //                                 break;
    //                             case 'js':
    //                                 $apcAction->forward_to_js = $request->to_user_id;
    //                                 break;
    //                             case 'us':
    //                                 $apcAction->forward_to_us = $request->to_user_id;
    //                                 break;
    //                             case 'sec':
    //                                 $apcAction->forward_to_sec = $request->to_user_id;
    //                                 break;

    //                             case 'cio-io':
    //                                 $apcAction->forward_to_cio_io = $request->to_user_id;
    //                                 break;

    //                             case 'so-us':
    //                                 $apcAction->forward_to_so = $request->to_user_id;
    //                                 break;
                               
    //                                 case 'ro-aro':
    //                                 $apcAction->forward_to_ro_aro = $request->to_user_id;
    //                                 break;
    //                                 case 'ro':
    //                                 $apcAction->forward_to_ro = $request->to_user_id;
    //                                 break;
    //                         }
    //                     }

    //                     if($request->sent_through_rk == 1){
    //                          $apcAction->sent_through_rk = 1;
    //                          $apcAction->sent_through_rk_id = $cmp->added_by;
    //                     }

    //                     $apcAction->status = 'Forwarded';
    //                     // $apcAction->type = '1';
    //                     // $apcAction->remarks = $request->remark;
    //                     $apcAction->save();


    //                     // $apcAction = new ComplaintAction();
    //                     // $apcAction->complaint_id = $complainId;
    //                     // $apcAction->forward_by_ps = $userId;

    //                     // $apcAction->forward_to_lokayukt = $request->forward_to;
                       
    //                     // $apcAction->status = 'Forwarded';
    //                     // $apcAction->type = '1';
    //                     // $apcAction->remarks = $request->remark;
    //                     // $apcAction->save();
    //                 }
                
    //             }

    //                        EmployeeFilePermission::where('file_id', $request->file_id)
    //                         ->update([
    //                             'can_view' => 0,
    //                             'can_edit' => 0,
    //                         ]);


    //                         EmployeeFilePermission::updateOrCreate(
    //                             [
    //                                 'file_id' => $request->file_id,
    //                                 'user_id' => $request->to_user_id
    //                             ],
    //                             [
    //                                 'can_view' => 1,
    //                                 'can_edit' => 1,
    //                                 'given_by' => $userId
    //                             ]
    //                         );
                        
    //          return response()->json([
    //                 'status' => true,
    //                 'message' => 'Forwarded Successfully',
    //                 'data' => $cmp
    //             ], 200);
            
    //         // else{
    //         //         return response()->json([
    //         //         'status' => false,
    //         //         'errors' => 'OTP not verified'
    //         //     ], 422);
    //         // }
        
    //     }else{
            
    //          return response()->json([
    //                 'status' => false,
    //                 'message' => 'Please check Id'
    //             ], 401);
    //     }

    // }

    public function forwardPersonalFile(Request $request)
{
    $userId = Auth::id();

    // ✅ Sender (Auth User)
    $authUser = User::with('role','subrole')->find($userId);
    $AuthroleFwd = $authUser->role->name ?? null;
    $AuthsubroleFwd = $authUser->subrole->name ?? null;

    // ✅ Receiver (To User)
    $toUser = User::with('role','subrole')->find($request->to_user_id);
    $roleFwd = $toUser->role->name ?? null;
    $subroleFwd = $toUser->subrole->name ?? null;

    // ✅ Validation
    $validation = Validator::make($request->all(), [
        'file_id' => 'required',
        'to_user_id' => 'required|exists:users,id',
    ], [
        'file_id.required' => 'File Id is required.',
        'to_user_id.required' => 'Forward to user is required.',
        'to_user_id.exists' => 'Forward to user does not exist.',
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validation->errors()
        ], 422);
    }

    if ($request->file_id && $request->isMethod('post')) {

        $cmp = EmployeeUploadFiles::findOrFail($request->file_id);

        if ($cmp) {
            $cmp->permission_user_id = $request->to_user_id;

            if ($cmp->save()) {

                $apcAction = new ComplainActionPersonalFile();
                $apcAction->file_id = $request->file_id;

                // =========================
                // ✅ Dynamic forward_by
                // =========================
                if (in_array($AuthroleFwd, ['lok-ayukt', 'up-lok-ayukt','ps','dispatch'])) {

                    if ($AuthroleFwd === 'lok-ayukt') {
                        $apcAction->forward_by_lokayukt = $userId;
                    } elseif ($AuthroleFwd === 'up-lok-ayukt') {
                        $apcAction->forward_by_uplokayukt = $userId;
                    } elseif ($AuthroleFwd === 'dispatch') {
                        $apcAction->forward_by_dispatch = $userId;
                    } else {
                        $apcAction->forward_by_ps = $userId;
                    }

                } elseif ($AuthroleFwd === 'supervisor' && $AuthsubroleFwd) {

                    switch ($AuthsubroleFwd) {
                        case 'ds':
                            $apcAction->forward_by_ds = $userId;
                            break;
                        case 'js':
                            $apcAction->forward_by_js = $userId;
                            break;
                        case 'us':
                            $apcAction->forward_by_us = $userId;
                            break;
                        case 'sec':
                            $apcAction->forward_by_sec = $userId;
                            break;
                        case 'cio-io':
                            $apcAction->forward_by_cio_io = $userId;
                            break;
                        case 'so-us':
                            $apcAction->forward_by_so_us = $userId;
                            break;
                        case 'ro-aro':
                            $apcAction->forward_by_ro_aro = $userId;
                            break;
                        case 'ro':
                            $apcAction->forward_by_ro = $userId;
                            break;
                    }
                }

                // =========================
                // ✅ Dynamic forward_to
                // =========================
                if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps','dispatch'])) {

                    if ($roleFwd === 'lok-ayukt') {
                        $apcAction->forward_to_lokayukt = $request->to_user_id;
                    } elseif ($roleFwd === 'up-lok-ayukt') {
                        $apcAction->forward_to_uplokayukt = $request->to_user_id;
                    }elseif ($roleFwd === 'dispatch') {
                        $apcAction->forward_to_dispatch = $request->to_user_id;
                    } else {
                        $apcAction->forward_to_ps = $request->to_user_id;
                    }

                } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                    switch ($subroleFwd) {
                        case 'ds':
                            $apcAction->forward_to_ds = $request->to_user_id;
                            break;
                        case 'js':
                            $apcAction->forward_to_js = $request->to_user_id;
                            break;
                        case 'us':
                            $apcAction->forward_to_us = $request->to_user_id;
                            break;
                        case 'sec':
                            $apcAction->forward_to_sec = $request->to_user_id;
                            break;
                        case 'cio-io':
                            $apcAction->forward_to_cio_io = $request->to_user_id;
                            break;
                        case 'so-us':
                            $apcAction->forward_to_so = $request->to_user_id;
                            break;
                        case 'ro-aro':
                            $apcAction->forward_to_ro_aro = $request->to_user_id;
                            break;
                        case 'ro':
                            $apcAction->forward_to_ro = $request->to_user_id;
                            break;
                    }
                }

                if ($request->sent_through_rk == 1) {
                    $apcAction->sent_through_rk = 1;
                    $apcAction->sent_through_rk_id = $cmp->added_by;
                }

                $apcAction->status = 'Forwarded';
                $apcAction->save();
            }
        }

        // ✅ Permissions update
        EmployeeFilePermission::where('file_id', $request->file_id)
            ->update([
                'can_view' => 0,
                'can_edit' => 0,
            ]);

        EmployeeFilePermission::updateOrCreate(
            [
                'file_id' => $request->file_id,
                'user_id' => $request->to_user_id
            ],
            [
                'can_view' => 1,
                'can_edit' => 1,
                'given_by' => $userId
            ]
        );

        return response()->json([
            'status' => true,
            'message' => 'Forwarded Successfully',
            'data' => $cmp
        ], 200);
    }

    return response()->json([
        'status' => false,
        'message' => 'Please check Id'
    ], 401);
}
    public function forwardRtiFile(Request $request)
{

    $userId = Auth::id();
    // ✅ Sender (Auth User)
    $authUser = User::with('role','subrole')->find($userId);
    $AuthroleFwd = $authUser->role->name ?? null;
    $AuthsubroleFwd = $authUser->subrole->name ?? null;
    
    // ✅ Receiver (To User)
    $toUser = User::with('role','subrole')->find($request->to_user_id);
    $roleFwd = $toUser->role->name ?? null;
    $subroleFwd = $toUser->subrole->name ?? null;
    // dd($userId,$request->all(),$AuthsubroleFwd,$roleFwd);

    // ✅ Validation
    $validation = Validator::make($request->all(), [
        'file_id' => 'required',
        'to_user_id' => 'required|exists:users,id',
    ], [
        'file_id.required' => 'File Id is required.',
        'to_user_id.required' => 'Forward to user is required.',
        'to_user_id.exists' => 'Forward to user does not exist.',
    ]);

    if ($validation->fails()) {
        return response()->json([
            'status' => false,
            'errors' => $validation->errors()
        ], 422);
    }

    if ($request->file_id && $request->isMethod('post')) {

        $cmp = EmployeeUploadFiles::findOrFail($request->file_id);
        
        if ($cmp) {
            $cmp->permission_user_id = $request->to_user_id;
            $cmp->person_user_id = $request->to_user_id;

            if ($cmp->save()) {

                $apcAction = new RTIActionFile();
                $apcAction->file_id = $request->file_id;

                // =========================
                // ✅ Dynamic forward_by
                // =========================
                if (in_array($AuthroleFwd, ['lok-ayukt', 'up-lok-ayukt','ps','dispatch'])) {

                    if ($AuthroleFwd === 'lok-ayukt') {
                        $apcAction->forward_by_lokayukt = $userId;
                    } elseif ($AuthroleFwd === 'up-lok-ayukt') {
                        $apcAction->forward_by_uplokayukt = $userId;
                    } elseif ($AuthroleFwd === 'dispatch') {
                        $apcAction->forward_by_dispatch = $userId;
                    }  else {
                        $apcAction->forward_by_ps = $userId;
                    }

                } elseif ($AuthroleFwd === 'supervisor' && $AuthsubroleFwd) {

                    switch ($AuthsubroleFwd) {
                        case 'ds':
                            $apcAction->forward_by_ds = $userId;
                            break;
                        case 'js':
                            $apcAction->forward_by_js = $userId;
                            break;
                        case 'us':
                            $apcAction->forward_by_us = $userId;
                            break;
                        case 'sec':
                            $apcAction->forward_by_sec = $userId;
                            break;
                        case 'cio-io':
                            $apcAction->forward_by_cio_io = $userId;
                            break;
                        case 'so-us':
                            $apcAction->forward_by_so_us = $userId;
                            break;
                        case 'ro-aro':
                            $apcAction->forward_by_ro_aro = $userId;
                            break;
                        case 'ro':
                            $apcAction->forward_by_ro = $userId;
                            break;
                    }
                }

                // =========================
                // ✅ Dynamic forward_to
                // =========================
                if (in_array($roleFwd, ['lok-ayukt', 'up-lok-ayukt','ps','dispatch'])) {

                    if ($roleFwd === 'lok-ayukt') {
                        $apcAction->forward_to_lokayukt = $request->to_user_id;
                    } elseif ($roleFwd === 'up-lok-ayukt') {
                        $apcAction->forward_to_uplokayukt = $request->to_user_id;
                    }elseif ($roleFwd === 'dispatch') {
                        $apcAction->forward_to_dispatch = $request->to_user_id;
                    } else {
                        $apcAction->forward_to_ps = $request->to_user_id;
                    }

                } elseif ($roleFwd === 'supervisor' && $subroleFwd) {

                    switch ($subroleFwd) {
                        case 'ds':
                            $apcAction->forward_to_ds = $request->to_user_id;
                            break;
                        case 'js':
                            $apcAction->forward_to_js = $request->to_user_id;
                            break;
                        case 'us':
                            $apcAction->forward_to_us = $request->to_user_id;
                            break;
                        case 'sec':
                            $apcAction->forward_to_sec = $request->to_user_id;
                            break;
                        case 'cio-io':
                            $apcAction->forward_to_cio_io = $request->to_user_id;
                            break;
                        case 'so-us':
                            $apcAction->forward_to_so = $request->to_user_id;
                            break;
                        case 'ro-aro':
                            $apcAction->forward_to_ro_aro = $request->to_user_id;
                            break;
                        case 'ro':
                            $apcAction->forward_to_ro = $request->to_user_id;
                            break;
                    }
                }

                if ($request->sent_through_rk == 1) {
                    $apcAction->sent_through_rk = 1;
                    $apcAction->sent_through_rk_id = $cmp->added_by;
                }

                $apcAction->status = 'Forwarded';
                $apcAction->save();
            }
        }

        // ✅ Permissions update
       $rfp = RtiFilePermission::where('file_id', $request->file_id)->first();
       
        if ($rfp) {
            RtiFilePermission::where('file_id', $request->file_id)
            ->update([
                'can_view' => 0,
                'can_edit' => 0,
            ]);
        }
        
        // dd($request->to_user_id);
            RtiFilePermission::updateOrCreate(
                [
                    'file_id' => $request->file_id,
                    'user_id' => $request->to_user_id
                ],
                [
                    'can_view' => 1,
                    'can_edit' => 1,
                    'given_by' => $userId
                ]
            );
        

        return response()->json([
            'status' => true,
            'message' => 'Forwarded Successfully',
            'data' => $cmp
        ], 200);
    }

    return response()->json([
        'status' => false,
        'message' => 'Please check Id'
    ], 401);
}

    public function storePersonUserId(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'file_id' => 'required|exists:employee_files,id',
            'person_user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $file = EmployeeUploadFiles::find($request->file_id);

        $file->person_user_id = $request->person_user_id;
        $file->save();

        return response()->json([
            'status' => true,
            'message' => 'Person User ID assigned successfully',
            'data' => $file
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Something went wrong',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updatePersonUserId(Request $request)
{
    try {
        $adminId = Auth::id();
        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:employee_files,id',
            'person_user_id' => 'required|integer',
              'view' => 'required|boolean',
             'edit' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // ✅ Find Record
        $file = EmployeeUploadFiles::find($request->id);

        EmployeeFilePermission::where('file_id', $file->id)
            ->update([
                'can_view' => 0,
                'can_edit' => 0,
                'given_by' => $adminId
            ]);

        /*
        |--------------------------------------------------------------------------
        | Selected user ko permission do
        |--------------------------------------------------------------------------
        */
        EmployeeFilePermission::updateOrCreate(
            [
                'file_id' => $file->id,
                'user_id' => $request->person_user_id
            ],
            [
                'can_view' => $request->view ? 1 : 0,
                'can_edit' => $request->edit ? 1 : 0,
                'given_by' => $adminId
            ]
        );


        if (!$file) {
            return response()->json([
                'status' => false,
                'message' => 'Record not found'
            ], 404);
        }

        // ✅ Update
        $file->person_user_id = $request->person_user_id;
        $file->save();

        return response()->json([
            'status' => true,
            'message' => 'Authority updated successfully',
            'data' => $file
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Something went wrong',
            'error' => $e->getMessage()
        ], 500);
    }
}
public function updateRtiUserId(Request $request)
{
    try {
        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:employee_files,id',
            'person_user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // ✅ Find Record
        $file = EmployeeUploadFiles::find($request->id);

        if (!$file) {
            return response()->json([
                'status' => false,
                'message' => 'Record not found'
            ], 404);
        }

        // ✅ Update
        $file->person_user_id = $request->person_user_id;
        if($file->save()){

            User::where('id', $request->person_user_id)
            ->update([
                'is_pio' => 1
            ]);
        }

        return response()->json([
            'status' => true,
            'message' => 'Authority updated successfully',
            'data' => $file
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Something went wrong',
            'error' => $e->getMessage()
        ], 500);
    }
}
}
