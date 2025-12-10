<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityRequirement;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
  /**
   * Register any application services.
   */
  public function register(): void
  {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public function boot(): void
  {
    Scramble::configure()
      ->withDocumentTransformers(function (OpenApi $openApi) {
        $openApi->components->securitySchemes['key'] = SecurityScheme::apiKey('header', 'key');
        $openApi->components->securitySchemes['bearer'] = SecurityScheme::http('bearer');

        $openApi->security[] = new SecurityRequirement([
          'key' => [],
          'bearer' => [],
        ]);
      });

    Relation::morphMap([
      'StudentProfile'          => \App\Models\UAIS\StudentProfile::class,
      'StudentEducationHistory' => \App\Models\UAIS\StudentEducationHistory::class,
      'Course'                  => \App\Models\UAIS\Course::class,
      'CoursePlan'              => \App\Models\UAIS\CoursePlan::class,
      'EvaluationPlan'          => \App\Models\UAIS\EvaluationPlan::class,
      'Curriculum'              => \App\Models\UAIS\Curriculum::class,
      'CurriculumCourse'        => \App\Models\UAIS\CurriculumCourse::class,
      'AcademicActivity'        => \App\Models\UAIS\AcademicActivity::class,
      'ClassSchedule'           => \App\Models\UAIS\ClassSchedule::class,
      'ClassScheduleStudent'    => \App\Models\UAIS\ClassScheduleStudent::class,
      'ClassScheduleLecturer'   => \App\Models\UAIS\ClassScheduleLecturer::class,
      'StudentGradeTransfer'    => \App\Models\UAIS\StudentGradeTransfer::class,
      'Transcript'              => \App\Models\UAIS\Transcript::class,
      'StudentOutcome'          => \App\Models\UAIS\StudentOutcome::class,
    ]);
  }
}
