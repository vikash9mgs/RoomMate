import connectToDatabase from './_db.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing required fields' });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Missing email credentials');
    return res.status(500).json({ message: 'Server missing email configuration' });
  }

  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });

    const mailOptions = {
      from: `${name} <${email}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact form: ${name}`,
      text: `${message}\n\nPhone: ${phone || 'N/A'}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact send error:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
}
