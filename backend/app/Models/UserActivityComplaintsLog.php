<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserActivityComplaintsLog extends Model
{
    protected $table = 'user_activity_log';

    protected $fillable = [
        'user_id',
        'user_name',
        'type',
        'file_name',
        'file_path'
    ];
}
