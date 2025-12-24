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
    'status',
    'notes',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  public $appends = [
    'status_detail',
  ];

  public function doorprize()
  {
    return $this->belongsTo(Doorprize::class, 'doorprize_id', 'id');
  }

  public function getStatusDetailAttribute()
  {
    $status = [
      [
        'label' => 'Pending',
        'class' => 'bg-yellow-100 text-yellow-800',
      ],
      [
        'label' => 'Claimed',
        'class' => 'bg-blue-100 text-blue-800',
      ],
      [
        'label' => 'On Process',
        'class' => 'bg-indigo-100 text-indigo-800',
      ],
      [
        'label' => 'Shipped',
        'class' => 'bg-purple-100 text-purple-800',
      ],
      [
        'label' => 'Delivered',
        'class' => 'bg-green-100 text-green-800',
      ],
      [
        'label' => 'Cancelled',
        'class' => 'bg-red-100 text-red-800',
      ],
    ];

    return $status[$this->status] ?? null;
  }

}
