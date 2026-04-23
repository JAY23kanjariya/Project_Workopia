<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deleted - Workopia</title>
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
            background-color: #ef4444;
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
        .warning-box {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin-top: 20px;
            font-size: 14px;
            color: #991b1b;
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
                        <h2>Account Successfully Deleted</h2>
                        <p>Hello {{ $user->name }},</p>
                        <p>We're sorry to see you go. This email confirms that your Workopia account and all associated data have been permanently deleted as per your request.</p>
                        
                        <div class="warning-box">
                            <strong>This action is irreversible.</strong> Your profile, applications, and messages have been removed from our platform.
                        </div>

                        <p>If you believe this was a mistake or if you have any questions, please contact our support team immediately at [EMAIL_ADDRESS].</p>
                        
                        <p>We hope you'll consider using Workopia again in the future. Creating a new account is simple and can be done anytime.</p>
                        
                        <p>Thank you for being part of our community,<br>
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
