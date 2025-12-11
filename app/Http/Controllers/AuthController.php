<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Jobs\NotificationWhatsAppJob;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\Account\User;
use Illuminate\Support\Facades\Validator;
use App\Notifications\CodeResetPasswordNotification;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
  public function login(Request $request)
  {
    $request->validate([
      'username'  => ['required'],
      'password'  => ['required'],
    ]);
    $tipe = filter_var($request->username, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
    if ($token = Auth::attempt([$tipe => $request->username, 'password' => $request->password])) {
      // remember me
      if ($request->remember_me == 1) {
        Auth::factory()->setTTL(60 * 60 * 24 * 7 * 2);
      }

      $response = [
        'token'     => $token,
        'expires_in' => Auth::factory()->getTTL()
      ];

      activity($request->header('log-name') ?? $request->log_name)->log('Login IP: ' . $request->ip() . ' | Browser: ' . $request->userAgent());
      return response($response, 201);

    } else {
      return response()->json([
        'message' => __('auth.failed')
      ], 401);
    }
  }

  /**
   * Get the authenticated User.
   * @response array{"id": "string", "name": "string", "email": "string", "email_verified_at": "string|null", "username": "string", "avatar": "string|null", "created_at": "string", "updated_at": "string", "deleted_at": "string|null", "created_by": "int|null", "updated_by": "int|null", "deleted_by": "int|null", "role_names": array<string>, "permission_names": array<string>}
   */
  public function profile(Request $request)
  {
    $user = User::find(Auth::user()->id);
    $data = $user->toArray();
    $data['role_names']         = $user->roles()->pluck('name');
    $data['permission_names']   = $user->getAllPermissions()->pluck('name');
    return $data;
  }

  /**
   * Get the authenticated User.
   *
   * @return \Illuminate\Http\JsonResponse
   */
  public function update_profile(Request $request)
  {
    $user = User::find(Auth::user()->id)->load('country', 'marriage_status', 'region', 'religion', 'mapping_employee_user.employee.position_history.position', 'mapping_employee_user.employee.position_delegation_history.position', 'mapping_employee_user.employment_status_history', 'gender', 'students.education_background.periode_masuk', 'students.program_study.faculty', 'students.parent.pendidikan_ayah', 'students.parent.pendidikan_ibu', 'lecturer.kepegawaian.sumber_gaji', 'lecturer.data_pribadi_lain', 'lecturer.jabatan_fungsional.jabatan_fungsional', 'lecturer.pendidikan_formal.gelar_akademik', 'lecturer.pendidikan_formal.jenjang_pendidikan', 'lecturer.pendidikan_formal.bidang_studi', 'lecturer.kepangkatan.pangkat_golongan', 'lecturer.program_studies.faculty');
    $data = $request->validate([
      'name'              => ['required'],
      'email_personal'    => ['nullable', 'email'],
      'phone_number'      => ['nullable'],
      'phone_number_code' => ['nullable'],
      'address'           => ['nullable'],
    ]);
    $phone_number = preg_replace('/\D/', '', $data['phone_number']);
    if (Str::startsWith($phone_number, '08')) {
      $phone_number = substr($phone_number, 1);
    }
    $data['phone_number'] = $data['phone_number_code'] . '-' . implode('-', str_split($phone_number, 4));
    $user->update($data);
    return response()->json([
      'success'   => true,
      'message'   => 'Profile updated successfully',
    ], 200);
  }

  public function notification(Request $request)
  {
    $user = User::find(Auth::user()->id);
    return response()->json([
      'success'   => true,
      'data'      => $user->unreadNotifications->map(fn($notification) => [
        'id'            => $notification->id,
        'type'          => $notification->type,
        'data'          => $notification->data,
        'created_at'    => $notification->created_at->diffForHumans(),
      ])
    ], 200);
  }

  public function mark_notification(Request $request)
  {
    Auth::user()
      ->unreadNotifications
      ->when($request->input('id'), function ($query) use ($request) {
        return $query->where('id', $request->input('id'));
      })
      ->markAsRead();

    return response()->json([
      'success'   => true,
      'message'   => 'Notification marked as read'
    ], 200);
  }

  public function mark_all_notification(Request $request)
  {
    Auth::user()
      ->unreadNotifications
      ->when($request->input('id'), function ($query) use ($request) {
        return $query->whereIn('id', $request->input('id'));
      })
      ->markAsRead();

    return response()->json([
      'success'   => true,
      'message'   => 'All notification marked as read'
    ], 200);
  }

  public function has_permission(Request $request)
  {
    $request->validate([
      'permission' => ['required']
    ]);

    return response()->json([
      'success'   => can($request->permission),
    ], 200);
  }

  public function has_role(Request $request)
  {
    $request->validate([
      'role' => ['required']
    ]);

    $user = User::find(Auth::user()->id);
    return response()->json([
      'success'   => $user->hasRole($request->role),
    ], 200);
  }

  public function forgot_password(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'email' => 'required|email'
    ]);

    if ($validator->fails()) {
      return response()->json(['success' => false, 'message' => 'Data not valid', 'errors' => $validator->errors()], 422);
    }

    $user = User::where('email', $request->email)->first();
    if (!$user) {
      return response()->json(['success' => false, 'message' => 'Email not found'], 422);
    }
    $code = mt_rand(100000, 999999);
    $personal_access_token = DB::table('personal_access_tokens')->where('tokenable_type', 'App\Models\Account\User')->where('tokenable_id', $user->id)->where('name', 'Code Reset Password')->first();
    if ($personal_access_token) {
      $code = $personal_access_token->token;
    } else {
      DB::table('personal_access_tokens')->insert([
        'tokenable_type'  => 'App\Models\Account\User',
        'tokenable_id'    => $user->id,
        'name'            => 'Code Reset Password',
        'token'           => $code,
        'created_at'      => now(),
        'updated_at'      => now()
      ]);
    }
    try {
      $user->notify(new CodeResetPasswordNotification([
        'title' => 'Code for Reset Password',
        'message' => 'Your code for reset password is ' . $code,
        'code'  => $code
      ]));

      activity()->log($request->email . ' Forgot Password IP: ' . $request->ip() . ' | Browser: ' . $request->useragent());
      return response()->json([
        'success'   => true,
        'message'   => 'Code sent to your email'
      ], 200);
    } catch (\Throwable $th) {
      return response()->json([
        'success'   => false,
        'message'   => $th->getMessage(),
        'trace'     => $th->getTrace()
      ], 500);
    }
  }

  public function change_password(Request $request)
  {
    $request->validate([
      'old_password'  => ['required'],
      'password'      => ['required', 'min:8', 'confirmed'],
    ]);

    if ($request->old_password == $request->password) {
      return response()->json([
        'success'    => false,
        'message'    => 'Old password and new password cannot be the same'
      ], 422);
    }

    $user = User::find(Auth::user()->id);
    if (Hash::check($request->old_password, $user->password)) {
      $user->update([
        'password'  => Hash::make($request->password),
        'password2' => hash('sha512', $request->password)
      ]);

      $response = Http::withoutVerifying()->post(config('app_link.ldap_url') . '/change-password', [
        'username'  => $user->username,
        'password'  => $request->password
      ]);

      if (!$response->ok()) {
        Log::error("change password active directory failed. " . $response->body());
      }

      dispatch(new NotificationWhatsAppJob($user->phone_number, 'Your password has been successfully reset. If you did not perform this action, please contact support immediately.'));
      activity()->log('Change Password IP: ' . $request->ip() . ' | Browser: ' . $request->useragent());
      return response()->json([
        'success'    => true,
        'message'    => 'Password changed successfully'
      ], 200);
    }

    return response()->json([
      'success'    => false,
      'message'    => 'Old password not match'
    ], 422);
  }

  public function change_avatar(Request $request)
  {
    $request->validate([
      'avatar'    => ['nullable', 'image', 'max:2048']
    ]);
    $user = User::findOrFail(Auth::user()->id);
    if ($user->avatar) {
      if (Storage::disk('s3')->exists($user->avatar)) {
        Storage::disk('s3')->delete($user->avatar);
      }
    }
    if ($request->delete) {
      $user->avatar = null;
    } elseif ($request->hasFile('avatar')) {
      $user->avatar = $request->file('avatar')->store('avatar', 's3');
    } else {
      return response()->json([
        'success'       => false,
        'message'       => 'Avatar not found',
      ], 422);
    }
    $user->save();

    activity()->log('Change Avatar IP: ' . $request->ip() . ' | Browser: ' . $request->userAgent());
    return response()->json([
      'success'       => true,
      'message'       => 'Avatar changed successfully',
    ], 200);
  }

  public function user_reset_password(Request $request)
  {
    $user = User::where('email', $request->email)->firstOrFail();
    return response()->json([
      'success'   => true,
      'data'      => $user
    ], 200);
  }

  public function confirm_token_code(Request $request)
  {
    $validator =  Validator::make($request->all(), [
      'code'  => 'required|numeric|digits:6',
      'email' => 'required|email',
    ]);
    if ($validator->fails()) {
      return response()->json(['success' => false, 'message' => 'Data not valid', 'errors' => $validator->errors()], 422);
    }
    $user = User::where('email', $request->email)->first();
    $personal_access_token = DB::table('personal_access_tokens')->where('tokenable_type', 'App\Models\Account\User')->where('tokenable_id', $user->id)->where('name', 'Code Reset Password')->where('token', $request->code)->first();
    if ($personal_access_token) {
      return response()->json(['success' => true, 'message' => 'Code valid'], 200);
    } else {
      return response()->json(['success' => false, 'message' => 'Code not valid'], 422);
    }
  }

  public function reset_password(Request $request)
  {
    $validator =  Validator::make($request->all(), [
      'token'     => 'required',
      'email'     => 'required|email',
      'password'  => 'required|min:8|confirmed',
    ]);

    if ($validator->fails()) {
      return response()->json(['success' => false, 'message' => 'Data not valid', 'errors' => $validator->errors()], 422);
    }

    $user = User::where('email', $request->email)->first();
    if (!$user) {
      return response()->json(['success' => false, 'message' => 'Email not found'], 422);
    }

    $personal_access_token = DB::table('personal_access_tokens')->where('tokenable_type', 'App\Models\Account\User')->where('tokenable_id', $user->id)->where('name', 'Code Reset Password')->where('token', $request->token)->first();
    if ($personal_access_token) {
      $user->update([
        'password'  => Hash::make($request->password),
      ]);
      DB::table('personal_access_tokens')->where('id', $personal_access_token->id)->delete();
    } else {
      return response()->json(['success' => false, 'message' => 'Code not valid'], 422);
    }

    try {
      $response = Http::withoutVerifying()->post(config('app_link.ldap_url') . '/change-password', [
        'username'  => $user->username,
        'password'  => $request->password
      ]);

      if (!$response->ok()) {
        Log::error("change password active directory failed. " . $response->body());
      }
    } catch (\Throwable $th) {
      Log::error("change password active directory failed. " . $response->body());
    }

    dispatch(new NotificationWhatsAppJob($user->phone_number, 'Your password has been successfully reset. If you did not perform this action, please contact support immediately.'));

    activity()->log($request->email . ' Reset Password IP: ' . $request->ip() . ' | Browser: ' . $request->useragent());
    return response()->json(['success' => true, 'message' => 'Password reset successfully'], 200);
  }

  /**
   * logout
   *
   * @return void
   */
  public function logout(Request $request)
  {
    Auth::logout();

    activity()->log('Logout IP: ' . $request->ip() . ' | Browser: ' . $request->useragent());
    return response()->json([
      'success'    => true
    ], 200);
  }
}
