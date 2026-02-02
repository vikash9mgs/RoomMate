import connectToDatabase from '../_db.js';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

export default async function handler(req, res) {
  const method = req.method;
  // Expect URL like /api/auth/favorites/:listingId
  const pathParts = req.url.split('/').filter(Boolean); // ['', 'api', 'auth', 'favorites', ':id']
  const listingId = pathParts[pathParts.length - 1];

  if (!listingId) {
    return res.status(400).json({ message: 'Missing listingId in URL' });
  }

  await connectToDatabase();

  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (method === 'PUT') {
      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { $addToSet: { favorites: listingId } },
        { new: true }
      ).populate('favorites');

      if (updatedUser) return res.json(updatedUser.favorites);
      return res.status(404).json({ message: 'User not found' });
    } else if (method === 'DELETE') {
      const updatedUser = await User.findByIdAndUpdate(
        decoded.id,
        { $pull: { favorites: listingId } },
        { new: true }
      ).populate('favorites');

      if (updatedUser) return res.json(updatedUser.favorites);
      return res.status(404).json({ message: 'User not found' });
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update favorites' });
  }
}
