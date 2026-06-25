<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PersonalFileDocument extends Model
{
    protected $table = 'personal_file_documents'; 
     protected $fillable = [
        'file_id',
        'type',
        'title',
        'file',
        
    ];
}
