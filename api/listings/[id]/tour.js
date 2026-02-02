import connectToDatabase from '../../_db.js';
import Listing from '../../../server/models/Listing.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  const { id } = req.query || {};
  const { fullName, phone, tourDate } = req.body;

  if (!fullName || !phone || !tourDate) return res.status(400).json({ message: 'Please fill in all required fields.' });

  try {
    const listing = await Listing.findById(id).populate('user');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const owner = listing.user;
    if (!owner || !owner.email) return res.status(404).json({ message: "Owner email not found" });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS');
      return res.status(500).json({ message: 'Server configuration error: Missing email credentials.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOptions = {
      from: `"RoomMate Tour Request" <${process.env.EMAIL_USER}>`,
      to: owner.email,
      subject: `New Tour Request for: ${listing.title}`,
      html: `<p>New tour request from ${fullName} (${phone}) for ${tourDate}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Tour request sent successfully!' });
  } catch (error) {
    console.error('Error sending tour request:', error);
    return res.status(500).json({ message: 'Failed to send tour request' });
  }
}
