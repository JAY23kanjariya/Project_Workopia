<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;


class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // create roles as Admin, Employer, Candidate
        Role::create([
            'name' => 'Admin',
        ]);
        Role::create([
            'name' => 'Employer',
        ]);
        Role::create([
            'name' => 'Candidate',
        ]);
    }
}
