import { Request, Response } from 'express';
import { Contact } from '../../database/model';
import { sendContactNotificationToAdmin, sendContactConfirmationToUser } from '../../helper/email';

export const submitContact = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                status: 400,
                message: 'Name, email, subject, and message are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 400,
                message: 'Please provide a valid email address'
            });
        }

        // Message length validation
        if (message.length < 10) {
            return res.status(400).json({
                status: 400,
                message: 'Message must be at least 10 characters long'
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                status: 400,
                message: 'Message must not exceed 2000 characters'
            });
        }

        // Get client information
        const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        // Create contact record
        const contact = new Contact({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            subject: subject.trim(),
            message: message.trim(),
            ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
            userAgent
        });

        await contact.save();

        // Send emails (don't wait for them to complete)
        Promise.all([
            sendContactNotificationToAdmin({
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                message: contact.message,
                ipAddress: contact.ipAddress,
                userAgent: contact.userAgent
            }),
            sendContactConfirmationToUser({
                name: contact.name,
                email: contact.email,
                subject: contact.subject,
                message: contact.message
            })
        ]).catch(error => {
            console.error('Email sending failed:', error);
            // Don't fail the request if email fails
        });

        res.status(201).json({
            status: 201,
            message: 'Thank you for contacting Pokiifuns Games! We will get back to you soon.',
            data: {
                contactId: contact._id,
                submittedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Contact submission error:', error);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: error.message
        });
    }
};
