import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
}

export function policyMiddleware(requiredPolicy) {
  return (req, res, next) => {
    if (!req.user || !req.user.policies?.includes(requiredPolicy) && !req.user.policies?.includes('*')) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
} 