<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Doorprize extends Model
{
  use BaseModel, CustomSoftDeletes;

  protected $table      = 'doorprizes';
  public $incrementing  = false;
  protected $keyType    = 'string';
  protected $fillable   = [
    'name',
    'description',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  public $appends = [
    'total_winners',
    'winners_quota',
  ];

  public function images()
  {
    return $this->hasMany(DoorprizeImage::class, 'doorprize_id', 'id');
  }

  public function winners()
  {
    return $this->hasMany(Winner::class, 'doorprize_id', 'id');
  }

  public function adjustWinnersQuota($newQuota)
  {
    $currentWinnersCount = $this->winners()->count();

    if ($newQuota > $currentWinnersCount) {
      $toAdd = $newQuota - $currentWinnersCount;
      for ($i = 0; $i < $toAdd; $i++) {
        $code = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4) . '-' . substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4) . '-' . substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 4));
        $this->winners()->create([
          'code' => $code,
        ]);
      }
    } elseif ($newQuota < $currentWinnersCount) {
      $toRemove = $currentWinnersCount - $newQuota;
      $winnersToDelete = $this->winners()->latest()->take($toRemove)->get();
      foreach ($winnersToDelete as $winner) {
        $winner->delete();
      }
    }
  }

  public function getTotalWinnersAttribute()
  {
    return $this->winners()->whereNotNull('claimed_at')->count();
  }

  public function getWinnersQuotaAttribute()
  {
    return $this->winners()->count();
  }
}
