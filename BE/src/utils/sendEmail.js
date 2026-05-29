import nodemailer from 'nodemailer';

// Simple email sender function using Nodemailer
const sendEmail = async (options) => {
  // Create a Gmail transporter using credentials from .env
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       // smtp.gmail.com
    port: process.env.EMAIL_PORT,       // 587
    secure: false,                      // Use STARTTLS (not SSL) for port 587
    auth: {
      user: process.env.EMAIL_USER,     // Your Gmail address
      pass: process.env.EMAIL_PASS,     // Your Gmail password or App Password
    },
    tls: {
      rejectUnauthorized: false,        // Allows self-signed certs during local dev
    },
  });

  // Define the email options (from, to, subject, body)
  const mailOptions = {
    from: `"Job Portal" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // Send the email and return the result
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent successfully. Message ID:', info.messageId);
  return info;
};

export default sendEmail;
