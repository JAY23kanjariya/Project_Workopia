<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendTestMail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mail:test {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a test email to verify SMTP configuration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        $this->info("Sending test email to: {$email}...");

        try {
            \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\TestMail());
            $this->info("Success! Check your inbox.");
        } catch (\Exception $e) {
            $this->error("Failed to send email.");
            $this->error($e->getMessage());
        }
    }
}
