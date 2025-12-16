<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Doorprize extends Model
{
  use BaseModel, CustomSoftDeletes;

  protected $table    = 'doorprizes';
  protected $fillable = [
    'name',
    'description',
    'created_by',
    'updated_by',
    'deleted_by',
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
        $this->winners()->create([
          'code' => uniqid('WIN-'),
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
}
