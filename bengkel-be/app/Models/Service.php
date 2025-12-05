<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public $timestamps = false;
    protected $table = "service";

    protected $fillable = ['name','price','create_at','update_at'];
}
