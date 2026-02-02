import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

/**
 * Middleware to verify JWT token from Authorization header
 * Attaches user to request object
 */
export async function verifyToken(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    throw new Error('Not authorized, no token');
  }

  const token = auth.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) throw new Error('User not found');
  return user;
}

/**
 * Wrapper to apply auth to serverless handlers
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
}
