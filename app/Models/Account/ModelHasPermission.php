<?php

namespace App\Models\Account;

use App\Models\BaseModel;

class ModelHasPermission extends BaseModel
{
  protected $table = 'model_has_permissions';
  public $timestamps = false;
  protected $fillable = [
    'permission_id',
    'model_type',
    'model_id',
  ];

  public function permission()
  {
    return $this->belongsTo(Permission::class, 'permission_id', 'id');
  }

  public function user()
  {
    return $this->belongsTo(User::class, 'model_id', 'id');
  }
}
