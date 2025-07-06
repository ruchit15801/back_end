import { Request, Response } from 'express';
import { Admin } from '../../database/model';
import { generateAccessToken, generateRefreshToken } from '../../helper/jwt';
import { AuthRequest } from '../../helper/auth';

export const adminSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role = 'admin' } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Name, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 400,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
        if (existingAdmin) {
            return res.status(409).json({
                status: 409,
                message: 'Admin with this email already exists'
            });
        }

        // Create new admin
        const admin = new Admin({
            name,
            email: email.toLowerCase(),
            password,
            role
        });

        await admin.save();

        // Generate tokens
        const tokenPayload = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Remove password from response
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(201).json({
            status: 201,
            message: 'Admin created successfully',
            data: {
                admin: adminResponse,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Admin signup error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: 'Email and password are required'
            });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid email or password'
            });
        }

        // Check if admin is active
        if (!admin.isActive) {
            return res.status(401).json({
                status: 401,
                message: 'Account is deactivated'
            });
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate tokens
        const tokenPayload = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Remove password from response
        const adminResponse = admin.toObject();
        delete adminResponse.password;

        res.status(200).json({
            status: 200,
            message: 'Login successful',
            data: {
                admin: adminResponse,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Admin signin error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const adminProfile = async (req: AuthRequest, res: Response) => {
    try {
        res.status(200).json({
            status: 200,
            message: 'Profile retrieved successfully',
            data: {
                admin: req.admin
            }
        });
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                status: 400,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        const decoded = require('jsonwebtoken').verify(refreshToken, require('config').get('refresh_jwt_token_secret'));

        // Check if admin still exists and is active
        const admin = await Admin.findById(decoded.adminId).select('-password');
        if (!admin || !admin.isActive) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const tokenPayload = {
            adminId: admin._id.toString(),
            email: admin.email,
            role: admin.role
        };

        const newAccessToken = generateAccessToken(tokenPayload);

        res.status(200).json({
            status: 200,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({
            status: 401,
            message: 'Invalid refresh token'
        });
    }
}; 