<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;

class Winner extends Model
{
  use BaseModel;

  protected $table    = 'winners';
  protected $fillable = [
    'doorprize_id',
    'name',
    'email',
    'phone',
    'address',
    'claimed_at',
    'code',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  public function doorprize()
  {
    return $this->belongsTo(Doorprize::class, 'doorprize_id', 'id');
  }
}
