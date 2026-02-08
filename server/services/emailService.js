const nodemailer = require('nodemailer');

/**
 * Gmail SMTP transport.
 * 
 * IMPORTANT: You need a Gmail "App Password" (not your regular password).
 * Generate one at: https://myaccount.google.com/apppasswords
 * - Enable 2-Step Verification first
 * - Then create an App Password for "Mail"
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'cleochariaofficial@gmail.com',
    pass: process.env.SMTP_PASS || 'eejd emfu auhg mknk',
  },
});

const FROM_ADDRESS = `"LearnSphere" <${process.env.SMTP_USER || 'cleochariaofficial@gmail.com'}>`;

/**
 * Send a password-reset email.
 * In a real app you'd include a link to a frontend reset page with the token.
 * For this project we reset to a default password and email it.
 */
async function sendPasswordResetEmail(toEmail, tempPassword) {
  const mailOptions = {
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'LearnSphere — Your Password Has Been Reset',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #3d6b35; margin: 0;">🌿 LearnSphere</h1>
        </div>
        <p style="color: #334155; font-size: 15px;">Hi there,</p>
        <p style="color: #334155; font-size: 15px;">Your password has been reset. Use the temporary password below to log in, then change it in Settings.</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center; margin: 20px 0;">
          <p style="margin: 0 0 4px; color: #64748b; font-size: 12px;">Your temporary password</p>
          <p style="margin: 0; font-size: 22px; font-weight: bold; color: #3d6b35; letter-spacing: 2px;">${tempPassword}</p>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you didn't request this, please contact support immediately.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center;">LearnSphere &copy; 2026</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send course invitation emails.
 */
async function sendCourseInvitationEmail(toEmail, courseTitle, inviterName) {
  const mailOptions = {
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `You're invited to "${courseTitle}" on LearnSphere`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #3d6b35; margin: 0;">🌿 LearnSphere</h1>
        </div>
        <p style="color: #334155; font-size: 15px;">Hi there!</p>
        <p style="color: #334155; font-size: 15px;"><strong>${inviterName}</strong> has invited you to join the course:</p>
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
          <h2 style="margin: 0; color: #3d6b35;">${courseTitle}</h2>
        </div>
        <p style="color: #334155; font-size: 15px;">Sign up or log in at LearnSphere to start learning!</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="http://localhost:3000/#/login" style="display: inline-block; background: #3d6b35; color: white; padding: 12px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 15px;">Join LearnSphere</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center;">LearnSphere &copy; 2026</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send a contact/message email to an attendee.
 */
async function sendContactEmail(toEmail, subject, message, senderName) {
  const mailOptions = {
    from: FROM_ADDRESS,
    to: toEmail,
    subject: `[LearnSphere] ${subject}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #3d6b35; margin: 0;">🌿 LearnSphere</h1>
        </div>
        <p style="color: #334155; font-size: 15px;">Message from <strong>${senderName}</strong>:</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 16px 0;">
          <p style="margin: 0; color: #334155; font-size: 15px; white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 11px; text-align: center;">LearnSphere &copy; 2026</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendPasswordResetEmail,
  sendCourseInvitationEmail,
  sendContactEmail,
};
