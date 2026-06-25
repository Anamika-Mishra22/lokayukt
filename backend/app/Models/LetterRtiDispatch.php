<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LetterRtiDispatch extends Model
{
    protected $table = 'dispach_rit_letters';

    public $timestamps = false; 

    protected $fillable = [
        'file_id',
        'letter_type',
        'medium',
        'subject',
        'file',
        'letter_no',
        'added_by'
      
    ];
}
