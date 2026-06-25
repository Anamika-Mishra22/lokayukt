<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RtiFilePermission extends Model
{
      protected $table="rti_file_permission";

      protected $fillable = [
      'file_id',
      'user_id',
      'can_view',
      'can_edit',
      'given_by'
      ];
}
