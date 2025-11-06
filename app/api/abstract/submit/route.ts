import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/cloudflare-d1';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { createReadStream } from 'fs';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const file = formData.get('file') as File;

    if (!email || !file) {
      return NextResponse.json(
        { success: false, error: 'Email and file are required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only PDF, DOC, DOCX, and ODT files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if abstract already submitted
    if (user.abstract_status === 'submitted' || user.abstract_status === 'accepted') {
      return NextResponse.json(
        { success: false, error: 'Abstract already submitted' },
        { status: 400 }
      );
    }

    // Save file to temp folder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Use OS temp directory which is writable in serverless environments like Vercel
    const tmpDir = process.env.VERCEL ? '/tmp' : join(process.cwd(), 'tmp');
    const fileName = `abstract_${email}_${Date.now()}_${file.name}`;
    tempFilePath = join(tmpDir, fileName);
    
    try {
      await writeFile(tempFilePath, buffer);
    } catch (writeError) {
      // If tmp directory doesn't exist, try to create it
      const { mkdir } = await import('fs/promises');
      try {
        await mkdir(tmpDir, { recursive: true });
        await writeFile(tempFilePath, buffer);
      } catch (mkdirError) {
        console.error('Error creating temp directory:', mkdirError);
        throw new Error('Failed to save file');
      }
    }

    // Send email with Mailgun using file stream
    try {
      const originalFileName = file.name;
      const fileStream = createReadStream(tempFilePath);
      
      const messageData = {
        from: process.env.MAILGUN_FROM_EMAIL || 'Conference <conference@yourdomain.com>',
        to: process.env.CONFERENCE_EMAIL || 'conference@example.com',
        subject: `Abstract Submission - ${user.name}`,
        text: `New abstract submission received:
        
Name: ${user.name}
Email: ${user.email}
Mobile: ${user.mobile}
Category: ${user.category}
Submitted at: ${new Date().toLocaleString()}`,
        html: `<h2>New Abstract Submission</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${user.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${user.email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Mobile:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${user.mobile}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Category:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${user.category}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Submitted at:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
        <p>Please find the abstract attached.</p>`,
        attachment: {
          data: fileStream,
          filename: originalFileName
        }
      };

      await mg.messages.create(
        process.env.MAILGUN_DOMAIN || '',
        messageData
      );
    } catch (mailError: any) {
      console.error('Email sending error:', mailError);
      // Delete temp file even if email fails
      if (tempFilePath) {
        try {
          await unlink(tempFilePath);
        } catch {}
      }
      throw new Error('Failed to send email: ' + mailError.message);
    }

    // Update user in database
    await db.updateUser(email, {
      abstract_status: 'submitted',
      abstract_submitted_at: new Date().toISOString(),
    } as any);

    // Delete temp file after successful submission
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
        // Don't fail the request if file deletion fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Abstract submitted successfully!',
    });
  } catch (error: any) {
    console.error('Abstract submission error:', error);
    
    // Clean up temp file on error
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch {}
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Submission failed' },
      { status: 500 }
    );
  }
}
