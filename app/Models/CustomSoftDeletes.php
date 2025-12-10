<?php

namespace App\Models;

use App\Events\LoadDataEvent;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait CustomSoftDeletes
{
  use SoftDeletes;

  protected function performDeleteOnModel()
  {
    if ($this->forceDeleting) {
      parent::performDeleteOnModel();
    } else {
      $username = Auth::check() ? Auth::user()->username : null;
      if ($this->neofeeder_status) {
        neofeederStatus(Auth::user()->username, [
          'model_type'  => get_class($this),
          'model_id'    => $this->id,
          'synced'      => 0
        ]);
      }
      $this->deleted_by = $username;
      $this->deleted_at = $this->freshTimestamp();
      $this->saveQuietly();
    }
    event(new LoadDataEvent);
  }
}
