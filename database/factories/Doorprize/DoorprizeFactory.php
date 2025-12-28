<?php

namespace Database\Factories\Doorprize;

use App\Models\Doorprize\Doorprize;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoorprizeFactory extends Factory
{
    protected $model = Doorprize::class;

    public function definition(): array
    {
        return [
            'name'        => fake()->words(3, true),
            'description' => fake()->sentence(),
        ];
    }
}
