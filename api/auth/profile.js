import connectToDatabase from '../_db.js';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await connectToDatabase();

    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password').populate('favorites');
      return res.json(user);
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else if (req.method === 'PUT') {
    await connectToDatabase();

    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = auth.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.location = req.body.location || user.location;
        user.aadhar = req.body.aadhar || user.aadhar;
        if (req.body.profilePicture !== undefined) user.profilePicture = req.body.profilePicture;
        if (req.body.password) user.password = req.body.password;

        const updatedUser = await user.save();
        return res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          location: updatedUser.location,
          aadhar: updatedUser.aadhar,
          profilePicture: updatedUser.profilePicture,
          favorites: updatedUser.favorites,
          isAdmin: updatedUser.isAdmin,
          token: jwt.sign({ id: updatedUser._id }, process.env.JWT_SECRET, { expiresIn: '30d' }),
        });
      }

      return res.status(404).json({ message: 'User not found' });
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
