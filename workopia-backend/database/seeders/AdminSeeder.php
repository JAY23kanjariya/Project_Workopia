<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the admin role
        $adminRole = Role::where('name', 'Admin')->first();

        if ($adminRole) {
            User::create([
                'name' => 'Workopia Admin',
                'email' => 'admin@workopia.com',
                'password' => Hash::make('password'), // or simply 'password' if the model hashes it automatically
                'role_id' => $adminRole->id,
            ]);
        }
    }
}
