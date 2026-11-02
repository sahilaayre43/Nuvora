const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  try {
    const emailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
    const emailPassword = process.env.GMAIL_PASS
      || process.env.GMAIL_PASSWORD
      || process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPassword) {
      console.error('Email not sent: configure GMAIL_USER and GMAIL_PASSWORD.');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    const mailOptions = {
      from: `"NUVORA Support" <${emailUser}>`,
      to: email,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = sendEmail;