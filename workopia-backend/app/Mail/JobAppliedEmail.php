<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobAppliedEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $user;
    public $jobPost;

    public function __construct($user, $jobPost)
    {
        $this->user = $user;
        $this->jobPost = $jobPost;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Application Received: ' . $this->jobPost->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.job_applied',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
