import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get Mailgun credentials from environment variables
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !RECIPIENT_EMAIL) {
      console.error('Missing Mailgun configuration');
      return NextResponse.json(
        { success: false, error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    // Prepare form data for Mailgun API
    const formData = new FormData();
    formData.append('from', `FUSION-SDG Contact <fusion-sdg@ksrce.ac.in>`);
    formData.append('reply-to', email);
    formData.append('to', RECIPIENT_EMAIL);
    formData.append('subject', `[FUSION-SDG Contact] ${subject}`);
    formData.append('text', `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the FUSION-SDG Conference website contact form.
Reply to: ${email}
    `);
    formData.append('html', `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 15px 0; }
    .label { font-weight: bold; color: #6366f1; }
    .message-box { background: white; padding: 20px; border-left: 4px solid #6366f1; margin-top: 20px; border-radius: 4px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">FUSION-SDG Conference Website</p>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">From:</span> ${name}
      </div>
      <div class="info-row">
        <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      <div class="info-row">
        <span class="label">Subject:</span> ${subject}
      </div>
      <div class="message-box">
        <div class="label">Message:</div>
        <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
      </div>
      <div class="footer">
        <p>This email was sent from the FUSION-SDG Conference website contact form.</p>
        <p>To reply to this inquiry, please email: <a href="mailto:${email}">${email}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
    `);

    // Send email via Mailgun
    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    const response = await fetch(mailgunUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailgun API error:', errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
