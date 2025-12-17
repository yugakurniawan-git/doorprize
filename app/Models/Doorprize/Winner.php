<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Winner extends Model
{
  use BaseModel, CustomSoftDeletes;

  protected $table      = 'winners';
  public $incrementing  = false;
  protected $keyType    = 'string';
  protected $fillable   = [
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
