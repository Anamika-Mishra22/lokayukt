<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Permissions;
use App\Models\Modules;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;


class LoginController extends Controller
{
// public function login(Request $request)
// {
//     try {
//         $validator = Validator::make($request->all(), [
//             'user_name' => 'required|exists:users,user_name',
//             'password'  => 'required|string|min:6',
//         ], [
//             'user_name.exists' => 'This username is not registered.',
//         ]);

//         if ($validator->fails()) {
//             throw new ValidationException($validator);
//         }

//         $user = User::with(['role:id,name'])->where('user_name', $request->user_name)->first();
//         // dd($user ,$request->password ,$user->password);
//         // Password check
//         if (!Hash::check($request->password, $user->password)) {
//             return ApiResponse::generateResponse('error', 'Wrong password.', null, 401);
//         }

//         if ($user->status == 0) {
//             return ApiResponse::generateResponse('error', 'You are blocked by admin.', null, 403);
//         }

//         $token = $user->createToken('auth_token')->plainTextToken;

//         return ApiResponse::generateResponse('success', 'Login Successful.', [
//             'access_token' => $token,
//             'token_type'   => 'Bearer',
//             'user'         => $user,
//             // 'role' => $user->role->name ?? 'N/A',
//         ]);

//     } catch (ValidationException $e) {
//         $errors = collect($e->validator->errors()->toArray())
//             ->map(fn($messages) => $messages[0]);

//         return ApiResponse::generateResponse('error', 'Validation failed.', $errors, 422);
//     } catch (\Exception $e) {
//         return ApiResponse::generateResponse('error', 'Something went wrong during login.', [
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }



//  public function login(Request $request){

//     try {
       
//         $validator = Validator::make($request->all(), [
//             'user_name' => 'required|exists:users,user_name',
//             'password'  => 'required|string|min:6',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         if (!Auth::attempt($request->only('user_name', 'password'))) {
//             return ApiResponse::generateResponse('error', 'Invalid credentials.', null, 401);
//         }

//         // $user = Auth::user();
//         $user = $request->user();

//         if ($user->status == 0) {
//             return response()->json(['error' => 'You are blocked by admin.'], 403);
//         }

//         //  $permissions = Permissions::with('module')
//         // ->where('user_id', $user->id)
//         // ->get()
//         // ->map(function ($perm) {
//         //     return [
//         //         'module_id' => $perm->module_id,
//         //         'module' => $perm->module->name,
//         //         'can_view' => $perm->can_view,
//         //         'can_edit' => $perm->can_edit,
//         //     ];
//         // });

//         $token = $user->createToken('auth_token')->plainTextToken;

//         $deviceId = get_device_id();

//         audit_log([
//             'user_id'    => auth()->id(),
//             'action'     => 'LOGIN_SUCCESS',
//             'entity'     => null,
//             'entity_id'  => null,
//             'device_id'  => $deviceId,
//             'ip_addr'    => request()->ip(),
//             'user_agent' => request()->userAgent(),
//         ]);

//          return ApiResponse::generateResponse('success', 'Login Successful.', [
//             'access_token' => $token,
//             'token_type'   => 'Bearer',
//             'user'         => $user,
//             // 'permissions' => $permissions,
//             'role' => $user->role->name ?? 'N/A',
//             'subrole' => $user->subrole->name ?? 'N/A',
//         ]);

//     } catch (ValidationException $e) {
//         $errors = collect($e->validator->errors()->toArray())
//             ->map(fn($messages) => $messages[0]);

//         return ApiResponse::generateResponse('error', 'Validation failed.', $errors, 422);
//     } catch (\Exception $e) {
//         return ApiResponse::generateResponse('error', 'Something went wrong during login.', [
//             'message' => $e->getMessage(),
//         ], 500);
//     }
 
// }

// public function login(Request $request)
// {
//     try {

//         $validator = Validator::make($request->all(), [
//             'user_name' => 'required|exists:users,user_name',
//             'password'  => 'required|string|min:6',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         if (!Auth::attempt($request->only('user_name', 'password'))) {
//             return ApiResponse::generateResponse('error', 'Invalid credentials.', null, 401);
//         }

//         $user = $request->user();

//         if ($user->status == 0) {
//             return response()->json(['error' => 'You are blocked by admin.'], 403);
//         }

//         // ✅ Current device
//         $currentDeviceId = get_device_id();

//         // ✅ Get last login device from audit_log
//         // $lastLog = DB::table('audit_log')
//         //     ->where('user_id', $user->id)
//         //     ->whereNotNull('device_id')
//         //     ->orderBy('id', 'desc')
//         //     ->first();

//         // // 🔴 Device check
//         // if ($lastLog && $lastLog->device_id !== $currentDeviceId) {
//         //     return ApiResponse::generateResponse(
//         //         'error',
//         //         'Login not allowed from this device.',
//         //         null,
//         //         403
//         //     );
//         // }

//         // ✅ Token generate
//         $token = $user->createToken('auth_token')->plainTextToken;

//         // ✅ Save log
//         audit_log([
//             'user_id'    => $user->id,
//             'action'     => 'LOGIN_SUCCESS',
//             'entity'     => null,
//             'entity_id'  => null,
//             'device_id'  => $currentDeviceId,
//             'ip_addr'    => request()->ip(),
//             'user_agent' => request()->userAgent(),
//         ]);

//         return ApiResponse::generateResponse('success', 'Login Successful.', [
//             'access_token' => $token,
//             'token_type'   => 'Bearer',
//             'user'         => $user,
//             'role'         => $user->role->name ?? 'N/A',
//             'subrole'      => $user->subrole->name ?? 'N/A',
//         ]);

//     } catch (ValidationException $e) {

//         $errors = collect($e->validator->errors()->toArray())
//             ->map(fn($messages) => $messages[0]);

//         return ApiResponse::generateResponse('error', 'Validation failed.', $errors, 422);

//     } catch (\Exception $e) {

//         return ApiResponse::generateResponse('error', 'Something went wrong during login.', [
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }

// latest login with mac

public function login(Request $request)
{
    try {

        $validator = Validator::make($request->all(), [
            'user_name' => 'required|exists:users,user_name',
            'password'  => 'required|string|min:6',
            // 'mac' => 'required' // 🔥 IMPORTANT
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $deviceId = get_device_id();

        if (!Auth::attempt($request->only('user_name', 'password'))) {
              AuditLog::create([
                // 'user_id'    => $user->id,
                'action'     => 'Login Failed',
                // 'entity'     => 'users',
                // 'entity_id'  => $user->id,
                'device_id'  => $deviceId ?? null,
                'description'=> 'Invalid credentials for user '.$request->user_name,
                'ip_addr'    => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]);
            return ApiResponse::generateResponse('error', 'Invalid credentials.', null, 401);
        }

        $user = $request->user();

        if ($user->status == 0) {
            return response()->json(['error' => 'You are blocked by admin.'], 403);
        }

        // ✅ Current device (MAC / Machine ID)
        // $currentDeviceId = $request->mac;

        // ✅ FIRST LOGIN → bind device
        // if ($user->mac_address == null) {
        //     $user->mac_address = $currentDeviceId;
        //     $user->save();
        // }

        // // ❌ DEVICE MISMATCH → BLOCK
        // if ($user->mac_address !== $currentDeviceId) {
        //     return ApiResponse::generateResponse(
        //         'error',
        //         'Login not allowed from this device.',
        //         null,
        //         403
        //     );
        // }

        // ✅ Token generate
        $token = $user->createToken('auth_token')->plainTextToken;

        // ✅ Save audit log
        AuditLog::create([
            'user_id'    => $user->id,
            'action'     => 'LOGIN_SUCCESS',
            'entity'     => 'user',
            'entity_id'  => $user->id,
            'description'=> 'Login success for user ' . $user->name,
            'device_id'  => $deviceId,
            'ip_addr'    => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return ApiResponse::generateResponse('success', 'Login Successful.', [
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
            'role'         => $user->role->name ?? 'N/A',
            'subrole'      => $user->subrole->name ?? 'N/A',
        ]);

    } catch (ValidationException $e) {

        $errors = collect($e->validator->errors()->toArray())
            ->map(fn($messages) => $messages[0]);

        return ApiResponse::generateResponse('error', 'Validation failed.', $errors, 422);

    } catch (\Exception $e) {

        return ApiResponse::generateResponse('error', 'Something went wrong during login.', [
            'message' => $e->getMessage(),
        ], 500);
    }
}

// public function login(Request $request)
// {
//     try {

//         // VALIDATION
//         $validator = Validator::make($request->all(), [
//             'user_name' => 'required|exists:users,user_name',
//             'password'  => 'required|string|min:6',
//         ]);

//         if ($validator->fails()) {
//             return response()->json($validator->errors(), 422);
//         }

//         // ATTEMPT LOGIN (SESSION BASED)
//         if (!Auth::attempt($request->only('user_name', 'password'))) {
//             return ApiResponse::generateResponse(
//                 'error',
//                 'Invalid credentials.',
//                 null,
//                 401
//             );
//         }

//         // IMPORTANT → PREVENT SESSION FIXATION
//         $request->session()->regenerate();

//         // GET LOGGED USER WITH ROLE + SUBROLE
//         $user = Auth::user()->load('role', 'subrole');

//         // CHECK USER STATUS
//         if ($user->status == 0) {
//             Auth::logout();
//             return response()->json([
//                 'error' => 'You are blocked by admin.'
//             ], 403);
//         }

//         // AUDIT LOG
//         $deviceId = get_device_id();

//         audit_log([
//             'user_id'    => $user->id,
//             'action'     => 'LOGIN_SUCCESS',
//             'entity'     => null,
//             'entity_id'  => null,
//             'device_id'  => $deviceId,
//             'ip_addr'    => $request->ip(),
//             'user_agent' => $request->userAgent(),
//         ]);

//         // RESPONSE (NO TOKEN)
//         return ApiResponse::generateResponse(
//             'success',
//             'Login Successful.',
//             [
//                 'user' => $user,
//                 'role' => $user->role->name ?? null,
//                 'subrole' => $user->subrole->name ?? null,
//             ]
//         );

//     } catch (ValidationException $e) {

//         $errors = collect($e->validator->errors()->toArray())
//             ->map(fn($messages) => $messages[0]);

//         return ApiResponse::generateResponse(
//             'error',
//             'Validation failed.',
//             $errors,
//             422
//         );

//     } catch (\Exception $e) {

//         return ApiResponse::generateResponse(
//             'error',
//             'Something went wrong during login.',
//             ['message' => $e->getMessage()],
//             500
//         );
//     }
// }

public function resetDevice($id)
{
    $user = User::findOrFail($id);
    $user->mac_address = null;
    $user->save();

    return response()->json([
        'status' => true,
        'message' => 'Device reset'
    ]);
}


public function forgotPasswordCheck(Request $request)
{
    $request->validate(['user_name' => 'required|string']);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user) {
        return ApiResponse::generateResponse('error', 'Please enter correct Username.', null, 404);
    }

    return ApiResponse::generateResponse('success', 'Username found. Proceed to send OTP.');
}


public function sendOtp(Request $request)
{
    $request->validate(['user_name' => 'required|string']);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user) {
        return ApiResponse::generateResponse('error', 'Username not found.', null, 404);
    }

    $user->otp = '12345'; 
    $user->save();

    return ApiResponse::generateResponse('success', 'OTPSend successfully.');
}


public function verifyOtp(Request $request)
{
    $request->validate([
        'user_name' => 'required|string',
        'otp'       => 'required',
    ]);

    $user = User::where('user_name', $request->user_name)->first();

    if (! $user || $user->otp !== $request->otp) {
        return ApiResponse::generateResponse('error', 'Invalid OTP.', null, 403);
    }

    return ApiResponse::generateResponse('success', 'OTP verified successfully.');
}





public function resetPassword(Request $request)
{
    $validator = Validator::make($request->all(), [
        'user_name' => 'required|string',
        'otp'       => 'required',
        'password'  => 'required|confirmed|min:8',
    ], [
        'user_name.required' => 'Username is mandatory.',
        'otp.required'       => 'OTP is required.',
        'password.required'  => 'Enter correct password.',
        'password.confirmed' => 'Password and Confirm Password do not match.',
        'password.min'       => 'Password must contain at least 8 characters.',
    ]);

    $validator->after(function ($validator) use ($request) {
        $password = $request->password;

        if (!preg_match('/[A-Z]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one uppercase letter.');
        }
        if (!preg_match('/[0-9]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one number.');
        }
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $validator->errors()->add('password', 'Password must contain at least one special character.');
        }
    });

    if ($validator->fails()) {
        return ApiResponse::generateResponse('error', 'Validation failed.', $validator->errors()->toArray(), 422);
    }

    $user = User::where('user_name', $request->user_name)->first();
    if (! $user) {
        return ApiResponse::generateResponse('error', 'Username not found.', null, 404);
    }

    if ($user->otp !== $request->otp) {
        return ApiResponse::generateResponse('error', 'Invalid OTP.', null, 403);
    }

    $user->password = Hash::make($request->password);
    $user->otp = null;
    $user->save();

    return ApiResponse::generateResponse('success', 'Password reset successful.');
}

public function changePassword(Request $request)
{
    try {
        // ✅ Validation
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password'     => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status'  => false,
                'message' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $deviceId = get_device_id();

        // ✅ Check current password
        if (!Hash::check($request->current_password, $user->password)) {
            AuditLog::create([
            'user_id'    => $user->id,
            'action'     => 'Change Password Failed',
            'entity'     => 'users',
            'entity_id'  => $user->id,
            'device_id'  => $deviceId ?? null,
            'description'=> 'User entered wrong current password',
            'ip_addr'    => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
            return response()->json([
                'status'  => false,
                'message' => 'Current password is incorrect'
            ], 401);
        }

        // ✅ Update new password
        $user->password = Hash::make($request->new_password);
        
        if($user->save()){
           AuditLog::create([
                'user_id'    => $user->id,
                'action'     => 'Password Changed',
                'entity'     => 'users',
                'entity_id'  => $user->id,
                'device_id'  => get_device_id(),
                'description'=> 'User changed account password successfully',
                'ip_addr'    => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
            ]); 
        }

        return response()->json([
            'status'  => true,
            'message' => 'Password changed successfully'
        ]);

    } catch (\Exception $e) {


        return response()->json([
            'status'  => false,
            'message' => 'Something went wrong',
            'error'   => $e->getMessage()
        ], 500);
    }
}

  public function logout(Request $request){

      $request->user()->currentAccessToken()->delete();
            $deviceId = get_device_id();
            audit_log([
        'user_id'    => auth()->id(),
        'action'     => 'LOGOUT',
        'entity'     => 'users',
        'entity_id'  => auth()->id(),
        'device_id'  => $deviceId,
        'ip_addr'    => request()->ip(),
        'user_agent' => request()->userAgent(),
        ]);
        return ApiResponse::generateResponse('success','Logout Successfully');
    }
}
