import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL_USER,
        pass: process.env.CONTACT_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"KRIVEDA Contact" <${process.env.CONTACT_EMAIL_USER}>`,
      to: "krivedashopify@gmail.com",
      replyTo: email,
      subject: `New message from ${name} — KRIVEDA`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2E3B2C;">
          <h2 style="font-size: 24px; font-weight: 300; border-bottom: 1px solid #e0d8c8; padding-bottom: 12px;">
            New Contact Message
          </h2>
          <table style="width: 100%; margin-top: 16px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B6355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; width: 90px;">Name</td>
              <td style="padding: 8px 0; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B6355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em;">Email</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #B8912E;">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top: 20px; background: #f9f6f0; border-radius: 12px; padding: 16px 20px;">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #6B6355; margin: 0 0 8px 0;">Message</p>
            <p style="font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #aaa;">Sent from kriveda.com contact form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
