<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    // One to many relationship with users table as role_id
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
