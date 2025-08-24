import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();

    console.log('Email API called with:', { to, subject, message });

    // For now, we'll just log the email details since we don't have a real email service configured
    // In a real implementation, you would use services like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP

    console.log('📧 Email would be sent:');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Message:', message);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully (simulated)',
      details: {
        to,
        subject,
        messageLength: message.length
      }
    });

  } catch (error) {
    console.error('Error in email API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 