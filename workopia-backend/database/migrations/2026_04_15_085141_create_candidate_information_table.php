<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidate_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('phone_number')->nullable();
            $table->string('degree');
            $table->string('specialization')->nullable();
            $table->string('college_name');
            $table->decimal('cgpa', 4, 2)->nullable();
            $table->decimal('experience', 4, 1)->default(0); // years of experience
            $table->string('resume_link')->nullable();
            $table->text('bio')->nullable();
            $table->string('portfolio_link')->nullable();
            $table->string('linkedin_link')->nullable();
            $table->string('github_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_information');
    }
};
