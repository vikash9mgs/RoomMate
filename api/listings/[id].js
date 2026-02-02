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

  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: 'Missing id' });

  try {
    if (req.method === 'GET') {
      const listing = await Listing.findById(id).populate('user', 'name email profilePicture');
      if (listing) return res.json(listing);
      return res.status(404).json({ message: 'Listing not found' });
    } else if (req.method === 'DELETE') {
      const user = await protect(req);
      const listing = await Listing.findById(id);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      if (listing.user.toString() !== user._id.toString() && !user.isAdmin) return res.status(401).json({ message: 'Not authorized' });
      await listing.deleteOne();
      return res.json({ message: 'Listing removed' });
    } else if (req.method === 'PUT') {
      const user = await protect(req);
      const listing = await Listing.findById(id);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });
      if (listing.user.toString() !== user._id.toString() && !user.isAdmin) return res.status(401).json({ message: 'Not authorized' });

      const { type, title, description, price, location, amenities, images, contactPhone, aadhar, latitude, longitude } = req.body;
      listing.type = type || listing.type;
      listing.title = title || listing.title;
      listing.description = description || listing.description;
      listing.price = price || listing.price;
      listing.location = location || listing.location;
      listing.amenities = amenities || listing.amenities;
      listing.images = images || listing.images;
      listing.contactPhone = contactPhone || listing.contactPhone;
      listing.aadhar = aadhar || listing.aadhar;
      listing.latitude = latitude || listing.latitude;
      listing.longitude = longitude || listing.longitude;

      const updated = await listing.save();
      return res.json(updated);
    } else {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
