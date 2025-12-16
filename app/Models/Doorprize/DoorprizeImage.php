<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Model;

class DoorprizeImage extends Model
{
  use BaseModel, CustomSoftDeletes;

  protected $table    = 'doorprize_images';
  protected $fillable = [
    'doorprize_id',
    'image_path',
    'created_by',
    'updated_by',
    'deleted_by',
  ];

  public function doorprize()
  {
    return $this->belongsTo(Doorprize::class, 'doorprize_id', 'id');
  }
}
