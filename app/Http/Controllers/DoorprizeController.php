<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doorprize\Doorprize;
use Dedoc\Scramble\Attributes\QueryParameter;
use Illuminate\Support\Facades\Storage;

class DoorprizeController extends Controller
{
  /**
   * Display a listing of the resource.
   *
   * @return \Illuminate\Http\Response
   * @response array{"current_page": int, "data": object[], "first_page_url": "string", "from": int, "last_page": int, "last_page_url": "string", "links": object[], "next_page_url": "string", "path": "string", "per_page": int, "prev_page_url": "string", "to": int, "total": int}
   */
  #[QueryParameter('q', type: 'string', format: 'text', description: 'Search query')]
  #[QueryParameter('include', type: 'array<string>', format: 'csv', example: '["roles:id,name"]', description: '<p style="margin-bottom:0">Relationships to include:</p>
    <ul style="margin-top:0px;">
      <li>creator</li>
      <li>updater</li>
      <li>deleter</li>
    </ul>
  ')]
  #[QueryParameter('joins', type: 'array<string>', format: 'csv', example: '["table,on1,condition,on2,type"]', description: 'Relationships to join')]
  #[QueryParameter('fields', type: 'array<string>', format: 'csv', example: '["id","name","created_at"]', description: 'Columns to select similar to SQL queries')]
  #[QueryParameter('sort_by', type: 'string', format: 'text', description: 'Column to sort by.<br>
    if want to sort from "joins" use dot notation (e.g. roles.name).<br>
    if want to sort from "include" use arrow notation (e.g. roles->name)
  ')]
  #[QueryParameter('sort_type', type: 'string', format: 'text', description: 'Sort order (asc or desc)')]
  #[QueryParameter('per_page', type: 'integer', format: 'int32', description: 'Number of items per page')]
  #[QueryParameter('page', type: 'integer', format: 'int32', description: 'Page number')]
  #[QueryParameter('filters', type: 'object', format: 'json', example: '{"name":"test"}', description: 'Column filters as key-value pairs if want to filters on "include" or "joins" use arrow notation (e.g. profile->address->city)')]
  #[QueryParameter('wheres', type: 'array<string>', format: 'csv', example: '["column,operator,value"]' , description: 'Where conditions as array of strings')]
  public function index()
  {
    return Doorprize::list();
  }

  /**
   * Store a newly created resource or update an existing resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $data = $request->validate([
      'id'            => 'nullable|string',
      'name'          => 'required|string|max:100',
      'description'   => 'sometimes|string',
      'images'        => 'sometimes|array',
      'images.*'      => 'file|image|max:1024',
      'quota'         => 'sometimes|integer|min:1',
    ], [], [
      'name'        => 'Name',
      'description' => 'Description',
      'images'      => 'Images',
      'quota'       => 'Quota',
    ]);

    $doorprize = Doorprize::updateOrCreate(['id' => $request->id], $data);

    if ($request->hasFile('images')) {
      foreach ($request->file('images') as $image) {
        $path = $image->store('doorprize_images', 'public');
        $doorprize->images()->create([
          'image_path' => $path,
        ]);
      }
    }

    if (isset($data['quota'])) {
      $doorprize->adjustWinnersQuota($data['quota']);
    }

    return $doorprize->load('images');
  }

  /**
   * Display the specified resource.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  Doorprize  $doorprize
   * @return \Illuminate\Http\Response
   */
  #[QueryParameter('include', type: 'array<string>', format: 'csv', description: 'Relationships to include', example: '["roles:id,name"]')]
  public function show(Request $request, Doorprize $doorprize)
  {
    if ($request->has('include') && is_array($request->query('include'))) {
      $doorprize->load($request->query('include'));
    }
    return $doorprize;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  Doorprize  $doorprize
   * @return \Illuminate\Http\Response
   */
  public function destroy(Doorprize $doorprize)
  {
    $doorprize->delete();
    return ['message' => 'Doorprize deleted successfully.'];
  }
}
