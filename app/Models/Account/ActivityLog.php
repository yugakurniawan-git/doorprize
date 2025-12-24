<?php

namespace App\Models\Account;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
  use BaseModel;

  protected $table = 'activity_log';

  public function causer()
  {
    return $this->morphTo();
  }

  public function subject()
  {
    return $this->morphTo();
  }
}
