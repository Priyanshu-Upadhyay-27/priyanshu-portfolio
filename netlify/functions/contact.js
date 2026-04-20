import nodemailer from 'nodemailer';

export const handler = async (event) => {
  // 1. Check HTTP Method
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  // 2. Diagnostic Ping (Check terminal to see if these say "Loaded" or "MISSING")
  console.log("DIAGNOSTIC - User:", process.env.EMAIL_USER ? "Loaded" : "MISSING");
  console.log("DIAGNOSTIC - Pass:", process.env.EMAIL_PASS ? "Loaded" : "MISSING");

  // 3. Parse Body
  const { name, email, message } = JSON.parse(event.body);

  // 4. Configure Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 5. Execute Transmission
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sending to yourself
      replyTo: email,
      subject: `Portfolio Transmission: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'Transmission successful.' }) };
  } catch (error) {
    console.error('Core failure:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Transmission aborted.' }) };
  }
};