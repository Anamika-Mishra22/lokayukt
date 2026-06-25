<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintNotes extends Model
{
     protected $table = 'complaints_notes'; 
    public $timestamps = false; 
    protected $fillable = [
    'complaint_id',
    'description',
    'forward_to',
    'd_id',
    'range_from',
    'range_two',
    'forward_by'
];

   public function forwardByUser()
    {
        return $this->belongsTo(User::class, 'forward_by', 'id');
    }
}
