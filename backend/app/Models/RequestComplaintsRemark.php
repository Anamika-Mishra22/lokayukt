<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestComplaintsRemark extends Model
{
    protected $table = 'request_complaints_remarks'; 
    public $timestamps = false; 

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
