const nodemailer = require("nodemailer");

// For development, we'll use a test account from Ethereal Email.
// In production, configure with actual SMTP credentials.
let transporter;

async function initTransporter() {
  if (transporter) return transporter;

  // Use environment variables if provided
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  }

  // Fallback to Ethereal Email for testing
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log("Created Ethereal Test Email Account:", testAccount.user);
  return transporter;
}

exports.sendOtpEmail = async (toEmail, otp) => {
  try {
    const mailTransporter = await initTransporter();

    const info = await mailTransporter.sendMail({
      from: '"EM System Admin" <noreply@emsystem.local>',
      to: toEmail,
      subject: "Account Activation OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Account Activation</h2>
          <p>Your OTP for account activation is:</p>
          <h1 style="color: #4f46e5; letter-spacing: 2px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

exports.sendResetOtpEmail = async (toEmail, otp) => {
  try {
    const mailTransporter = await initTransporter();

    const info = await mailTransporter.sendMail({
      from: '"EM System Admin" <noreply@emsystem.local>',
      to: toEmail,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Your OTP is:</p>
          <h1 style="color: #ef4444; letter-spacing: 2px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    return false;
  }
};
