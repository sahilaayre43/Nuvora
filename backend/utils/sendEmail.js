const { Resend } = require('resend');

const sendEmail = async ({ email, subject, message }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error('Email is not configured. Set RESEND_API_KEY and EMAIL_FROM in backend/.env.');
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html: message,
  });

  if (error) {
    const deliveryError = new Error(`Email delivery failed (${error.name || 'RESEND_ERROR'}): ${error.message}`);
    deliveryError.code = error.name;
    throw deliveryError;
  }
};

module.exports = sendEmail;