<?php

namespace App\Models\Doorprize;

use App\Models\BaseModel;
use App\Models\CustomSoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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

  public $appends = [
    'image_url',
  ];

  public function doorprize()
  {
    return $this->belongsTo(Doorprize::class, 'doorprize_id', 'id');
  }

  public function getImageUrlAttribute()
  {
    return Storage::disk('public')->url($this->image_path);
  }
}
