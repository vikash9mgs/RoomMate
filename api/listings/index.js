import connectToDatabase from '../_db.js';
import Listing from '../../server/models/Listing.js';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

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
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const listings = await Listing.find({}).sort({ createdAt: -1 });
      return res.json(listings);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const user = await protect(req);
      const { type, title, description, price, location, amenities, images, contactPhone, aadhar, latitude, longitude } = req.body;

      const listing = new Listing({
        user: user._id,
        type,
        title,
        description,
        price,
        location,
        amenities,
        images,
        contactPhone,
        aadhar,
        latitude,
        longitude,
      });

      const created = await listing.save();
      return res.status(201).json(created);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
