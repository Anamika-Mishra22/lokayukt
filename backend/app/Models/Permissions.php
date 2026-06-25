<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Modules;
class Permissions extends Model
{
     protected $table = 'permissions'; 
       protected $fillable = [
        'user_id',
        'module_id',
        'can_view',
        'can_edit',
    ];
     public $timestamps = false; 

     public function permissions()
     {
     return $this->hasMany(Permission::class);
     }

     public function module()
     {
     return $this->belongsTo(Modules::class);
     }

     public function user()
     {
     return $this->belongsTo(User::class);
     }
}
