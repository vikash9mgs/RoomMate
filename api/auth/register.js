import connectToDatabase from '../_db.js';
import User from '../../server/models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role: role || 'user' });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        aadhar: user.aadhar,
        profilePicture: user.profilePicture,
        favorites: user.favorites,
        isAdmin: user.isAdmin,
        role: user.role,
        token: generateToken(user._id),
      });
    }

    return res.status(400).json({ message: 'Invalid user data' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
