import jwt from 'jsonwebtoken';
import config from 'config';

const jwtSecret = config.get('jwt_token_secret') as string;
const refreshJwtSecret = config.get('refresh_jwt_token_secret') as string;

export interface TokenPayload {
    adminId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, refreshJwtSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, jwtSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
    return jwt.verify(token, refreshJwtSecret) as TokenPayload;
};

export const extractTokenFromHeader = (authHeader: string): string | null => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}; 