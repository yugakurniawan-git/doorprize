<?php

namespace App\Models\Account;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;

class ModelHasRole extends Model
{
  use BaseModel;

  protected $table      = 'model_has_roles';
  public $timestamps    = false;
  public $incrementing  = false;
  protected $primaryKey = null;
  protected $fillable   = [
    'role_id',
    'model_type',
    'model_id',
    'is_active',
  ];

  public function role()
  {
    return $this->belongsTo(Role::class, 'role_id', 'id');
  }

  public function user()
  {
    return $this->belongsTo(User::class, 'model_id', 'id');
  }
}
