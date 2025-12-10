<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RestrictedDocsAccess
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next)
  {
    if (config('app.env') == 'local') {
      return $next($request);
    }
    return abort(403, 'Access to API documentation is restricted.');
  }
}
