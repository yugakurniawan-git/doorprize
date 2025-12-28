<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doorprize\Winner;
use Dedoc\Scramble\Attributes\QueryParameter;
use Illuminate\Support\Facades\Storage;

class WinnerController extends Controller
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
    return Winner::list();
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
      'doorprize_id'  => 'required|string|max:100',
      'name'          => 'required|string|max:100',
      'email'         => 'required|email|max:100',
      'phone'         => 'required|string|max:20',
      'address'       => 'required|string',
      'code'          => 'required|string|max:50',
    ], [], [
      'doorprize_id'  => 'Doorprize',
      'name'          => 'Name',
      'email'         => 'Email',
      'phone'         => 'Phone',
      'address'       => 'Address',
      'code'          => 'Code',
    ]);

    $winner = Winner::where('id', $request->id)->where('code', $request->code)->whereNull('claimed_at')->firstOrFail();
    $data['status'] = 1; // claimed
    $data['claimed_at'] = now();
    $winner->update($data);
    return $winner;
  }

  /**
   * Display the specified resource.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  Winner  $winner
   * @return \Illuminate\Http\Response
   */
  public function show(Request $request, Winner $winner)
  {
    $data = $winner->load([
      'doorprize:id,name',
      'doorprize.images:id,doorprize_id,image_path',
    ])->toArray();
    unset(
      $data['created_by'],
      $data['updated_by'],
      $data['deleted_by'],
      $data['created_at'],
      $data['updated_at'],
      $data['deleted_at'],
      $data['doorprize']['total_winners'],
      $data['doorprize']['winners_quota'],
    );
    return $data;
  }

  /**
   * Update the specified resource in storage.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  Winner  $winner
   * @return \Illuminate\Http\Response
   */
  public function update(Request $request, Winner $winner)
  {
    $data = $request->validate([
      'status'        => 'required|integer|in:0,1,2,3,4,5',
      'notes'         => 'nullable|string',
    ], [], [
      'status'        => 'Status',
      'notes'         => 'Notes',
    ]);

    $winner->update($data);
    return $winner;
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param  Winner  $winner
   * @return \Illuminate\Http\Response
   */
  public function destroy(Winner $winner)
  {
    $winner->delete();
    return ['message' => 'Winner deleted successfully.'];
  }
}
