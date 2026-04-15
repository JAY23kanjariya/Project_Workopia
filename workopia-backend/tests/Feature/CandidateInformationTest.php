<?php

namespace Tests\Feature;

use App\Models\CandidateInformation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CandidateInformationTest extends TestCase
{
    use RefreshDatabase;

    protected $candidateUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles
        Role::forceCreate(['id' => 1, 'name' => 'Admin']);
        Role::forceCreate(['id' => 2, 'name' => 'Employer']);
        Role::forceCreate(['id' => 3, 'name' => 'Candidate']);

        // Create a candidate user
        $this->candidateUser = User::factory()->create([
            'role_id' => 3,
        ]);
    }

    public function test_candidate_can_create_profile(): void
    {
        $data = [
            'degree' => 'B.Tech',
            'specialization' => 'Computer Science',
            'college_name' => 'IIT Bombay',
            'cgpa' => 9.5,
            'experience' => 2,
            'resume_link' => 'https://example.com/resume.pdf',
            'phone_number' => '1234567890',
            'bio' => 'Passionate developer',
        ];

        $response = $this->actingAs($this->candidateUser)
            ->postJson('/api/candidate/profile', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.degree', 'B.Tech')
            ->assertJsonPath('data.college_name', 'IIT Bombay');

        $this->assertDatabaseHas('candidate_information', [
            'user_id' => $this->candidateUser->id,
            'degree' => 'B.Tech',
        ]);
    }

    public function test_candidate_can_get_own_profile(): void
    {
        CandidateInformation::create([
            'user_id' => $this->candidateUser->id,
            'degree' => 'M.Tech',
            'college_name' => 'NIT Surathkal',
        ]);

        $response = $this->actingAs($this->candidateUser)
            ->getJson('/api/candidate/profile');

        $response->assertStatus(200)
            ->assertJsonPath('data.degree', 'M.Tech');
    }

    public function test_user_can_view_specific_candidate_profile(): void
    {
        $info = CandidateInformation::create([
            'user_id' => $this->candidateUser->id,
            'degree' => 'PhD',
            'college_name' => 'Stanford',
        ]);

        // Acting as an employer
        $employer = User::factory()->create(['role_id' => 2]);

        $response = $this->actingAs($employer)
            ->getJson("/api/candidate-information/{$info->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.degree', 'PhD');
    }

    public function test_candidate_can_update_profile(): void
    {
        $info = CandidateInformation::create([
            'user_id' => $this->candidateUser->id,
            'degree' => 'B.Sc',
            'college_name' => 'Old College',
        ]);

        $updateData = [
            'degree' => 'M.Sc',
            'college_name' => 'New University',
        ];

        // Using store (updateOrCreate logic)
        $response = $this->actingAs($this->candidateUser)
            ->postJson('/api/candidate/profile', $updateData);

        $response->assertSuccessful()
            ->assertJsonPath('data.degree', 'M.Sc');

        $this->assertDatabaseHas('candidate_information', [
            'user_id' => $this->candidateUser->id,
            'degree' => 'M.Sc',
        ]);
    }

    public function test_admin_can_list_all_candidate_profiles(): void
    {
        CandidateInformation::create([
            'user_id' => $this->candidateUser->id,
            'degree' => 'B.Tech',
            'college_name' => 'IIT',
        ]);

        $admin = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($admin)
            ->getJson('/api/candidate-information');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_admin_can_delete_candidate_profile(): void
    {
        $info = CandidateInformation::create([
            'user_id' => $this->candidateUser->id,
            'degree' => 'B.Tech',
            'college_name' => 'IIT',
        ]);

        $admin = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($admin)
            ->deleteJson("/api/candidate-information/{$info->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('candidate_information', ['id' => $info->id]);
    }

    public function test_non_candidate_cannot_access_profile_management(): void
    {
        $employer = User::factory()->create(['role_id' => 2]);

        $response = $this->actingAs($employer)
            ->getJson('/api/candidate/profile');

        $response->assertStatus(403);
    }
}
