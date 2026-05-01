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
        Schema::table('job_posts', function (Blueprint $table) {
            $table->string('employment_type')->nullable()->after('description'); // Full-time, Part-time, Internship, Contract
            $table->string('city')->nullable()->after('location');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('work_mode')->nullable()->after('country'); // On-site, Remote, Hybrid
            $table->string('salary_type')->nullable()->after('work_mode'); // Fixed, Range, Negotiable
            $table->decimal('min_salary', 15, 2)->nullable()->after('salary_type');
            $table->decimal('max_salary', 15, 2)->nullable()->after('min_salary');
            $table->text('required_skills')->nullable()->after('max_salary');
            $table->integer('min_experience')->nullable()->after('required_skills');
            $table->integer('max_experience')->nullable()->after('min_experience');
            $table->string('education_qualification')->nullable()->after('max_experience');
            $table->integer('openings_count')->default(1)->after('education_qualification');
            $table->date('application_deadline')->nullable()->after('openings_count');
            $table->string('company_name')->nullable()->after('application_deadline');
            $table->text('company_description')->nullable()->after('company_name');
            $table->string('company_website')->nullable()->after('company_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropColumn([
                'employment_type',
                'city',
                'state',
                'country',
                'work_mode',
                'salary_type',
                'min_salary',
                'max_salary',
                'required_skills',
                'min_experience',
                'max_experience',
                'education_qualification',
                'openings_count',
                'application_deadline',
                'company_name',
                'company_description',
                'company_website'
            ]);
        });
    }
};
