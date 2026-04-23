<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received - Workopia</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f7fa;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f7fa;
            padding-bottom: 40px;
        }
        .main {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            border-spacing: 0;
            color: #4a4a4a;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #10b981;
            padding: 40px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #ffffff;
        }
        .content {
            padding: 40px;
            line-height: 1.6;
        }
        .content h2 {
            color: #1e293b;
            font-size: 20px;
            margin-top: 0;
        }
        .content p {
            font-size: 16px;
            color: #475569;
            margin-bottom: 24px;
        }
        .job-card {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .job-title {
            font-weight: 700;
            font-size: 18px;
            color: #1e293b;
            margin: 0 0 10px 0;
        }
        .job-meta {
            font-size: 14px;
            color: #64748b;
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #94a3b8;
        }
        @media only screen and (max-width: 600px) {
            .main {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <center>
            <table class="main" width="100%">
                <tr>
                    <td class="header">
                        <h1>WORKOPIA</h1>
                    </td>
                </tr>
                <tr>
                    <td class="content">
                        <h2>Application Received! 🎉</h2>
                        <p>Hello {{ $user->name }},</p>
                        <p>We're excited to let you know that your application has been successfully submitted to the employer. The hiring team will review your profile and get back to you if you're selected for the next steps.</p>
                        
                        <div class="job-card">
                            <p class="job-title">{{ $jobPost->title }}</p>
                            <p class="job-meta"><strong>Company:</strong> {{ $jobPost->employer?->name ?? 'Workopia Employer' }}</p>
                            <p class="job-meta"><strong>Location:</strong> {{ $jobPost->location }}</p>
                            <p class="job-meta"><strong>Date Applied:</strong> {{ now()->format('M d, Y') }}</p>
                        </div>

                        <p>In the meantime, you can continue to:</p>
                        <ul style="padding-left: 20px; margin: 0; color: #475569;">
                            <li>Check your dashboard for application status updates.</li>
                            <li>Explore other exciting opportunities on Workopia.</li>
                            <li>Update your profile to make an even stronger impression.</li>
                        </ul>

                        <p>We'll notify you as soon as there's an update on your application.</p>
                        
                        <p>Best regards,<br>
                        <strong>The Workopia Team</strong></p>
                    </td>
                </tr>
            </table>
            <div class="footer">
                <p>&copy; {{ date('Y') }} Workopia Inc. All rights reserved.<br>
                Workopia Demo Gec,bhavnagar 364004</p>
            </div>
        </center>
    </div>
</body>
</html>
