import connectToDatabase from '../../_db.js';
import Listing from '../../../server/models/Listing.js';
import jwt from 'jsonwebtoken';
import User from '../../../server/models/User.js';
import nodemailer from 'nodemailer';

async function protect(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) throw new Error('Not authorized');
  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new Error('User not found');
  return user;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  const { id } = req.query || {};

  try {
    const user = await protect(req);
    const listing = await Listing.findById(id).populate('user');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status === 'Booked') return res.status(400).json({ message: 'This listing is already booked' });

    const { moveInDate, duration, guests, tenantName, tenantEmail, tenantPhone } = req.body;

    listing.status = 'Booked';
    listing.bookedBy = user._id;
    listing.bookingDate = new Date();
    listing.moveInDate = moveInDate;
    listing.duration = duration;
    listing.guests = guests;
    listing.tenantName = tenantName || user.name;
    listing.tenantEmail = tenantEmail || user.email;
    listing.tenantPhone = tenantPhone || user.phone;

    const updatedListing = await listing.save();

    if (listing.user && listing.user.email) {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
        const mailOptions = {
          from: `"RoomMate" <${process.env.EMAIL_USER}>`,
          to: listing.user.email,
          subject: `Your Room "${listing.title}" has been Booked!`,
          html: `<p>Tenant: ${updatedListing.tenantName} (${updatedListing.tenantEmail})</p>`,
        };
        await transporter.sendMail(mailOptions);
      }
    }

    return res.json(updatedListing);
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: error.message });
  }
}
