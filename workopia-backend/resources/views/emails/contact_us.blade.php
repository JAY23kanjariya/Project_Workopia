<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 40px; }
        .container { max-width: 600px; background: white; margin: 0 auto; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: #4f46e5; padding: 40px; text-align: center; color: white; }
        .content { padding: 40px; line-height: 1.6; }
        .field { margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; pb-4; }
        .label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 4px; }
        .value { font-size: 16px; font-weight: 500; color: #1e293b; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size: 24px; font-weight: 800;">Contact Inquiry</h1>
            <p style="margin:5px 0 0; opacity: 0.8;">New message from Workopia Support Hub</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From Candidate / User</div>
                <div class="value">{{ $firstName }} {{ $lastName }}</div>
            </div>
            <div class="field">
                <div class="label">Reply-To Email</div>
                <div class="value">{{ $email }}</div>
            </div>
            <div class="field" style="border:none;">
                <div class="label">Message Content</div>
                <div class="value" style="white-space: pre-wrap; background: #f8fafc; padding: 20px; border-radius: 12px; margin-top: 8px;">{{ $messageContent }}</div>
            </div>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Workopia Job Portal. Professional Support System.
        </div>
    </div>
</body>
</html>
