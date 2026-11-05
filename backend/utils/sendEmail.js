const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  const emailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const emailPassword = process.env.GMAIL_PASS
    || process.env.GMAIL_PASSWORD
    || process.env.EMAIL_PASSWORD;
  if (!emailUser || !emailPassword) {
    throw new Error('Email is not configured. Set GMAIL_USER and GMAIL_PASSWORD.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  await transporter.sendMail({
    from: `"NUVORA Support" <${emailUser}>`,
    to: email,
    subject,
    html: message,
  });
};

module.exports = sendEmail;