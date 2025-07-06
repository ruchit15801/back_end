import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from './jwt';
import { Admin } from '../database/model';

export interface AuthRequest extends Request {
    admin?: any;
}

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: 'Access token is required'
            });
        }

        const decoded = verifyAccessToken(token);
        const admin = await Admin.findById(decoded.adminId).select('-password');

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid or inactive admin account'
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            message: 'Invalid or expired token'
        });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.admin) {
            return res.status(401).json({
                status: 401,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                status: 403,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
}; 