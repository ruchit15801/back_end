import { Request, Response } from 'express';
import { Contact } from '../../database/model';
import { AuthRequest } from '../../helper/auth';

export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string;
        const search = req.query.search as string;

        const skip = (page - 1) * limit;

        // Build query
        let query: any = {};

        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        // Get total count
        const total = await Contact.countDocuments(query);

        // Get contacts with pagination
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 200,
            message: 'Contacts retrieved successfully',
            data: {
                contacts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get all contacts error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getContactById = async (req: Request, res: Response) => {
    try {
        const { contactId } = req.params;

        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({
                status: 404,
                message: 'Contact not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Contact retrieved successfully',
            data: { contact }
        });
    } catch (error) {
        console.error('Get contact by ID error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};


