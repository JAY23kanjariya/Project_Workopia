<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Workopia</title>
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
            background-color: #1e293b;
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
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            background-color: #2563eb;
            color: #ffffff !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
        }
        .warning-box {
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 20px;
            margin-top: 20px;
            font-size: 14px;
            color: #9a3412;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #94a3b8;
        }
        .raw-link {
            font-size: 12px;
            color: #94a3b8;
            word-break: break-all;
            margin-top: 20px;
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
                        <h2>Password Reset Request</h2>
                        <p>You are receiving this email because we received a password reset request for your Workopia account. No worries, it happens!</p>
                        
                        <div class="button-container">
                            <a href="{{ $resetLink }}" class="button" target="_blank">Reset My Password</a>
                        </div>

                        <p>This password reset link will expire in <strong>60 minutes</strong>.</p>
                        
                        <div class="warning-box">
                            <strong>Didn't request this?</strong> If you did not request a password reset, no further action is required. Your account is still secure.
                        </div>

                        <p style="margin-top: 30px;">Best regards,<br>
                        <strong>The Workopia Security Team</strong></p>

                        <div class="raw-link">
                            If the button above doesn't work, copy and paste this link into your browser:<br>
                            <a href="{{ $resetLink }}" style="color: #2563eb;">{{ $resetLink }}</a>
                        </div>
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