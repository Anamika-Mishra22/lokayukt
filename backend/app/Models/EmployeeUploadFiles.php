<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\RTIActionFile;

class EmployeeUploadFiles extends Model
{
    protected $table = 'employee_files'; 
    public $timestamps = false; 
    protected $guarded = [];

    public function user() {
        return $this->belongsTo(User::class,'added_by','id');
    }

    public function userName() {
        return $this->belongsTo(User::class,'person_user_id','id');
    }
    public function actions()
    {
        return $this->hasMany(RtiActionFile::class, 'file_id', 'id');
    }

    public function permissions()
{
    return $this->hasMany(EmployeeFilePermission::class, 'file_id');
}
}
