<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RequestComplaintsRemark;
use App\Models\User;

class RequestComplaints extends Model
{
    protected $table = 'request_complaints'; 
    public $timestamps = false; 

     public function remark()
    {
        return $this->hasMany(RequestComplaintsRemark::class, 'request_complaint_id');
    }
    
    public function user()
{
    return $this->belongsTo(User::class, 'user_id', 'id');
}
}
