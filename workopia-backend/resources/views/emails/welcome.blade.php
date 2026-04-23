<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Workopia</title>
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
            background-color: #2563eb;
            padding: 40px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
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
            font-size: 22px;
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
        .features {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .features-title {
            font-weight: 700;
            font-size: 14px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 15px;
            display: block;
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
                        <h2>Hello, {{ $user->name }}! 👋</h2>
                        <p>We're thrilled to have you join our community. Workopia is designed to help talented professionals like you find their dream careers and connect with top-tier recruiters.</p>
                        
                        <div class="features">
                            <span class="features-title">What's next for you?</span>
                            <ul style="padding-left: 20px; margin: 0; color: #475569;">
                                <li>Complete your profile to attract recruiters.</li>
                                <li>Explore thousands of job listings.</li>
                                <li>Set up job alerts for your dream roles.</li>
                            </ul>
                        </div>

                        <div class="button-container">
                            <a href="http://localhost:3000/sign-in" class="button">Sign In</a>
                        </div>

                        <p>If you have any questions, simply reply to this email. Our support team is always here to help.</p>
                        
                        <p>Happy job hunting!<br>
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
