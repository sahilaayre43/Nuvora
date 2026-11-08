const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  const user = process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASSWORD;
  const host = process.env.SMTP_HOST || (process.env.GMAIL_USER ? "smtp.gmail.com" : undefined);
  const from = process.env.EMAIL_FROM || user;
  const port = Number(process.env.SMTP_PORT || (process.env.GMAIL_USER ? 465 : 587));
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;

  if (!host || !user || !pass) {
    throw new Error("Email is not configured. Set SMTP credentials or GMAIL_USER and GMAIL_PASSWORD in backend/.env.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Email is not configured. SMTP_PORT must be a valid port number.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: message,
    });
  } catch (error) {
    const deliveryError = new Error(`Email delivery failed (${error.code || error.name || "SMTP_ERROR"}): ${error.message}`);
    deliveryError.code = error.code || error.name;
    throw deliveryError;
  }
};

module.exports = sendEmail;