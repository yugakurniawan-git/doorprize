<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;
use App\Models\Doorprize\Doorprize;
use App\Models\Account\User;

class DoorprizeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Artisan::call('migrate:fresh', ['--seed' => true]);
    }

    // Menguji endpoint index untuk mendapatkan daftar doorprize
    public function test_index_mengembalikan_daftar_doorprize()
    {
        $user = User::first();
        $token = auth('api')->login($user);
        Doorprize::factory()->count(3)->create();
        $response = $this->getJson('/api/doorprizes', [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
            'key' => config('setting.api_key'),
        ]);
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'current_page', 'data', 'first_page_url', 'from', 'last_page', 'last_page_url', 'links', 'next_page_url', 'path', 'per_page', 'prev_page_url', 'to', 'total'
                 ]);
    }

    // Menguji endpoint store untuk membuat data doorprize baru
    public function test_store_membuat_doorprize()
    {
        $user = User::first();
        $token = auth('api')->login($user);
        Storage::fake('public');
        $data = [
            'name' => 'Test Doorprize',
            'description' => 'Test description',
            'images' => [UploadedFile::fake()->image('test.jpg')],
            'winners_quota' => 2,
        ];
        $response = $this->postJson('/api/doorprizes', $data, [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
            'key' => config('setting.api_key'),
        ]);
        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'Test Doorprize']);
        $this->assertDatabaseHas('doorprizes', ['name' => 'Test Doorprize']);
    }

    // Menguji endpoint show untuk menampilkan detail doorprize
    public function test_show_menampilkan_doorprize()
    {
        $user = User::first();
        $token = auth('api')->login($user);
        $doorprize = Doorprize::factory()->create();
        $response = $this->getJson("/api/doorprizes/{$doorprize->id}", [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
            'key' => config('setting.api_key'),
        ]);
        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $doorprize->id]);
    }

    // Menguji endpoint destroy untuk menghapus doorprize
    public function test_destroy_menghapus_doorprize()
    {
        $user = User::first();
        $token = auth('api')->login($user);
        $doorprize = Doorprize::factory()->create();
        $response = $this->deleteJson("/api/doorprizes/{$doorprize->id}", [], [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
            'key' => config('setting.api_key'),
        ]);
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Doorprize deleted successfully.']);
        $this->assertSoftDeleted($doorprize);
    }
}
