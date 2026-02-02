import connectToDatabase from '../../_db.js';
import Listing from '../../../server/models/Listing.js';
import jwt from 'jsonwebtoken';
import User from '../../../server/models/User.js';

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
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  try {
    const user = await protect(req);
    const listings = await Listing.find({ user: user._id }).sort({ createdAt: -1 });
    return res.json(listings);
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: error.message || 'Not authorized' });
  }
}
