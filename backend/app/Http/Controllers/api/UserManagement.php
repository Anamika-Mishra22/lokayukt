<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB as FDB;
use DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Permissions;


class UserManagement extends Controller
{
    public function index()
    {
        $users = User::with('role:id,name,label','department:id,name','subrole:id,name,label')->get();
        return response()->json([
            'status' => true,
            'data' => $users
        ]);
    }
    public function allEmployees()
    {
        // $employees = User::with('role:id,name,label','department:id,name')->where('user_type','employee')->get();
        $employees = User::with('role:id,name,label','department:id,name','subrole:id,name,label')->get();
        return response()->json([
            'status' => true,
            'data' => $employees
        ]);
    }

    public function user_management(Request $request)
    {
        // Validate input
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            // 'designation'  => 'required|exists:designations,id',
            // 'department'   => 'required|exists:departments,id',
            // 'district_id'  => 'required|exists:district_master_new,district_code',
            // 'ps_parent'  => 'required',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            //  'district_id.required'     => 'Please select a district.',
            // 'district_id.exists'       => 'Selected district does not exist.',
            //  'department.required'     => 'Please select a department.',
            // 'department.exists'       => 'Selected department does not exist.',
            // 'designation.required'     => 'Please select a designation.',
            // 'designation.exists'       => 'Selected designation does not exist.',
             'number.required'                                                     => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }


        // $baseUserName = str::slug($request->name);
        // $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
        // $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';
        // $lastUser = User::orderBy('id', 'desc')->first();
        // if ($lastUser) {
        //     $lastNumber = (int) substr($lastUser->username, 4); // LOKA hata diya
        //     $newNumber = $lastUser->id + 1;
        // } else {
        //     $newNumber = 100; // first user
        // }
        // $userName = 'LOKA' . str_pad($newNumber, 8, '0', STR_PAD_LEFT);

       $lastUser = User::orderBy('id', 'desc')->first();

        if ($lastUser) {
            $newNumber = $lastUser->id + 1;
        } else {
            $newNumber = 100; // agar tumhe 100 se start karna hai
        }

        // direct str_pad use karo (simple & best)
        $userName = 'LOKA' . str_pad($newNumber, 7, '0', STR_PAD_LEFT);
        // parent_user_id
       $otp = rand(100000, 999999);

        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'number'       => $request->number,
            'otp'          => $otp,
            'role_id'      => $request->role_id,
            'sub_role_id'      => $request->sub_role_id,
            'district_id'  => $request->district_id,
            'designation_id'  => $request->designation,
            'department_id'   => $request->department,
            'user_name'    => $userName,
            'password1'    => $request->password,
            'password'     => bcrypt($request->password),
            'is_pio'     => $request->is_pio,
        ]);



    if ($user->role_id == 6 || $user->role_id == 3) {
            $user->update([
                'parent_user_id' => $request->ps_parent
            ]);
        }
        // dd($user);

        return response()->json([
            'status' => true,
            'message' => 'User created successfully',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'number',
                'role_id',
                'designation',
                'department',
                'user_name'
            ])
        ]);
    }

    public function editUser(Request $request,$id)
    {
        $user = User::findorfail($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function updateUser(Request $request,$id)
    {   
       
         $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            'designation'  => 'nullable|string|max:230',
            'department'   => 'nullable|string|max:200',
            'district_id'  => 'required|exists:district_master_new,district_code',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            'district_id.required'     => 'Please select a district.',
            'district_id.exists'       => 'Selected district does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        //  'name'         => $request->name,
        //     'email'        => $request->email,
        //     'number'       => $request->number,
        //     'role_id'      => $request->role_id,
        //     'district_id'  => $request->district_id,
        //     'designation_id'  => $request->designation,
        //     'department_id'   => $request->department,
        //     'user_name'    => $userName,
        //     // 'password1'    => $request->password,
        //     'password'     => bcrypt($request->password),

       

        $user = User::findorfail($id);
        
        if($request->ps_parent != $id){

        }

        // $dataAssign =  DB::table('complaints')->where('assign_to_ps', $id)->where('approved_rejected_by_ps','=', 0)->pluck('id');

        // if($dataAssign){
        //        $userId = $id; // current user id

        //     foreach ($dataAssign  as $item) {
        //         DB::table('complaints_assign_user')->insert([
        //             'complaint'    => $item,
        //             'assign_to_ps' => $userId,
        //             'created_at'   => now(),
        //             'updated_at'   => now(),
        //         ]);
        //     }
      
        // }
        
        $dataAssign = DB::table('complaints')
            ->where('assign_to_ps', $id)
            ->where('approved_rejected_by_ps', 0)
            ->pluck('id');

        if ($dataAssign->isNotEmpty()) {

            $insertData = [];

            foreach ($dataAssign as $item) {
                $insertData[] = [
                    'complaint'    => $item,
                    'assign_to_ps' => $id,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ];
            }

            DB::table('complaints_assign_user')->insert($insertData);
        }
        

         if($user->isDirty($request->name)){
              $baseUserName = str::slug($request->name);
                $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
                $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';
                $user->user_name     = $userName;
            }
       
            $user->name          = $request->name;       
            $user->email         = $request->email;
            $user->role_id       = $request->role_id;
            $user->sub_role_id   = $request->sub_role_id;
            $user->number        = $request->number;
            $user->district_id   = $request->district_id;
            $user->otp            = $request->otp;
            $user->department_id = $request->department;
            $user->designation_id = $request->designation;

        //   if ($request->filled('otp')) {
        //     $user->otp = bcrypt($request->otp); 
        //    }
          if ($request->filled('password')) {
            $user->password = bcrypt($request->password); 
           }
           
           if ($request->is_pio == 1) {

                    $existingPio = User::where('is_pio', 1)
                        ->where('id', '!=', $user->id) // current user exclude
                        ->exists();

                    if ($existingPio) {
                        return response()->json([
                            'status' => false,
                            'message' => 'Another person is already PIO.'
                        ], 422);
                    }
                }
            $user->save();

            if ($user->role_id == 6 || $user->role_id == 3 || $user->role_id == 12 || $user->role_id == 13 || $user->role_id == 14) {
                $user->update([
                    'parent_user_id' => $request->ps_parent
                ]);
            }
       

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully'
        ]);
    }

    public function changeStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }
        // $user->status = "1" ? "0" : "1";
        $user->status = ($user->status == "1") ? "0" : "1";
        $user->save();
        return response()->json([
            'status' => true,
            'message' => 'User status updated successfully',
            'data' => $user
        ]);
    }

    
     public function employee_management(Request $request)
    {
        // Validate input
        // dd($request->all());
        $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            // 'designation'  => 'required|exists:designations,id',
            // 'department'   => 'required|exists:departments,id',
            // 'district_id'  => 'required|exists:district_master_new,district_code',
            // 'ps_parent'  => 'required',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            //  'district_id.required'     => 'Please select a district.',
            // 'district_id.exists'       => 'Selected district does not exist.',
            //  'department.required'     => 'Please select a department.',
            // 'department.exists'       => 'Selected department does not exist.',
            // 'designation.required'     => 'Please select a designation.',
            // 'designation.exists'       => 'Selected designation does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }


        // $baseUserName = str::slug($request->name);
        // $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
        // $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';

        // parent_user_id

         $lastUser = User::orderBy('id', 'desc')->first();

        if ($lastUser) {
            $newNumber = $lastUser->id + 1;
        } else {
            $newNumber = 100; // agar tumhe 100 se start karna hai
        }

        // direct str_pad use karo (simple & best)
        $userName = 'LOKA' . str_pad($newNumber, 7, '0', STR_PAD_LEFT);
        // parent_user_id
       $otp = rand(100000, 999999);
       

        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'number'       => $request->number,
            'role_id'      => $request->role_id,
            // 'sub_role_id'      => $request->sub_role_id,
            'district_id'  => $request->district_id,
            'designation_id'  => $request->designation,
            'department_id'   => $request->department,
            'user_name'    => $userName,
            'password1'    => $request->password,
            'password'     => bcrypt('password123'),
            // 'user_type'     => "employee",
        ]);



    // if ($user->role_id == 6) {
    //         $user->update([
    //             'parent_user_id' => $request->ps_parent
    //         ]);
    //     }
        // dd($user);

        return response()->json([
            'status' => true,
            'message' => 'Employee created successfully',
            'data' => $user->only([
                'id',
                'name',
                'email',
                'number',
                'role_id',
                'designation',
                'department',
                'user_name'
            ])
        ]);
    }

    public function editEmployee(Request $request,$id)
    {
        $user = User::findorfail($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function updateEmployee(Request $request,$id)
    {   
         $validator = Validator::make($request->all(), [
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'       => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/'
            ],
            'number'         => 'required|numeric|digits:10|unique:users,number',
            'role_id'      => 'required|exists:roles,id',
            'designation'  => 'nullable|string|max:230',
            'department'   => 'nullable|string|max:200',
            'district_id'  => 'required|exists:district_master_new,district_code',
        ], [

            'name.required'        => 'Name is required.',
            'email.required'       => 'Email is required.',
            'email.email'          => 'Enter a valid email address.',
            'email.unique'         => 'This email is already in use.',
            'password.required'    => 'Password is required.',
            'password.min'         => 'Password must be at least 8 characters.',
            'password.confirmed'   => 'Password confirmation does not match.',
            'password.regex'       => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
            'role_id.required'     => 'Please select a role.',
            'role_id.exists'       => 'Selected role does not exist.',
            'district_id.required'     => 'Please select a district.',
            'district_id.exists'       => 'Selected district does not exist.',
             'number.required'         => 'Please enter the mobile number.',
        'number.numeric'          => 'Mobile number must be numeric.',
        'number.digits'           => 'Mobile number must be exactly 10 digits.',
        'number.unique'           => 'This mobile number is already registered.',

        ]);

        //  'name'         => $request->name,
        //     'email'        => $request->email,
        //     'number'       => $request->number,
        //     'role_id'      => $request->role_id,
        //     'district_id'  => $request->district_id,
        //     'designation_id'  => $request->designation,
        //     'department_id'   => $request->department,
        //     'user_name'    => $userName,
        //     // 'password1'    => $request->password,
        //     'password'     => bcrypt($request->password),

       

        $user = User::findorfail($id);

         if($user->isDirty($request->name)){
              $baseUserName = str::slug($request->name);
                $count = User::where('user_name', 'LIKE', "$baseUserName%")->count();
                $userName = $count > 0 ? $baseUserName . '-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT) : $baseUserName . '-001';
                $user->user_name     = $userName;
            }
       
            $user->name          = $request->name;       
            $user->email         = $request->email;
            $user->role_id       = $request->role_id;
            $user->sub_role_id   = $request->sub_role_id;
            $user->number        = $request->number;
            $user->district_id   = $request->district_id;
            $user->department_id = $request->department;
            $user->designation_id = $request->designation;

          if ($request->filled('password')) {
            $user->password = bcrypt($request->password); // always hash passwords!
           }
           

            $user->save();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found'
            ], 404);
        }
        return response()->json([
            'status' => true,
            'data' => $user
        ]);
    }
    public function deleteEmployee($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Employee not found'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }

public function assignPermission(Request $request)
{
    DB::beginTransaction();

    try {

        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'permissions' => 'required|array',
            'permissions.*.can_view' => 'nullable|boolean',
            'permissions.*.can_edit' => 'nullable|boolean',
        ], [
            'user_id.required' => 'User id is required',
            'user_id.exists' => 'Selected user does not exist',

            'permissions.required' => 'Permission is required',
            'permissions.array' => 'Permissions format wrong',

            'permissions.*.can_view.boolean' => 'View permission must be true/false',
            'permissions.*.can_edit.boolean' => 'Edit permission must be true/false',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ module ids validate karo (IMPORTANT 🔥)
        $validModuleIds = DB::table('modules')->pluck('id')->toArray();

        foreach ($request->permissions as $moduleId => $perm) {
            if (!in_array((int)$moduleId, $validModuleIds)) {
                return response()->json([
                    'status' => false,
                    'message' => "Invalid module id: $moduleId"
                ], 422);
            }
        }

        // ✅ Old permissions delete
        Permissions::where('user_id', $request->user_id)->delete();

        // ✅ Insert new permissions
        foreach ($request->permissions as $moduleId => $perm) {

            Permissions::create([
                'user_id' => $request->user_id,
                'module_id' => (int)$moduleId,
                'can_view' => !empty($perm['can_view']) ? 1 : 0,
                'can_edit' => !empty($perm['can_edit']) ? 1 : 0,
            ]);
        }

        DB::commit();

        return response()->json([
            'status' => true,
            'message' => 'Permissions updated successfully'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'status' => false,
            'message' => 'Failed to update permissions',
            'error' => $e->getMessage() // 👈 debugging ke liye
        ], 500);
    }

    
}
public function getUserPermissions($user_id)
{
    try {

        // ✅ check user exist
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found'
            ], 404);
        }

        // ✅ saare modules
        $modules = DB::table('modules')->get();

        // ✅ user ke permissions
        $permissions = Permissions::where('user_id', $user_id)->get();

        // 🔥 format for React (important)
        $formatted = [];

        foreach ($modules as $module) {

            $perm = $permissions->firstWhere('module_id', $module->id);

            $formatted[$module->id] = [
                'module_name' => $module->name,
                'can_view' => $perm ? $perm->can_view : 0,
                'can_edit' => $perm ? $perm->can_edit : 0,
            ];
        }

        return response()->json([
            'status' => true,
            'user_id' => $user_id,
            'data' => $formatted
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => 'Something went wrong',
            'error' => $e->getMessage()
        ], 500);
    }
}

  public function resetAllUsersPassword()
{
    DB::beginTransaction();

    try {

        $users = DB::table('users')->select('id')->get();

        foreach ($users as $user) {

            // 10 character random password
            $plainPassword = substr(str_shuffle(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            ), 0, 10);

            // 5 digit random OTP
            $otp = rand(10000, 99999);

            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'password1' => $plainPassword,
                    'password'  => bcrypt($plainPassword),
                    'otp'       => $otp,
                    'updated_at'=> now()
                ]);
        }

        DB::commit();

        return response()->json([
            'status'  => true,
            'message' => 'All user passwords and OTP updated successfully'
        ]);

    } catch (\Exception $e) {

        DB::rollBack();

        return response()->json([
            'status'  => false,
            'message' => $e->getMessage()
        ], 500);
    }
}
}
