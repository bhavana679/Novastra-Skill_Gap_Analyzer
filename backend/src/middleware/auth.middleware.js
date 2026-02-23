import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'undefined' || token === 'null' || token === '') {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
            }

            const decoded = jwt.verify(token, config.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth Error:', error.message);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

export { protect };
