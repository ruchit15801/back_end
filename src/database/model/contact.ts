import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'pending' | 'read' | 'replied';
    ipAddress?: string;
    userAgent?: string;
}

const contactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'read', 'replied'],
        default: 'pending'
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

const Contact = mongoose.model<IContact>('Contact', contactSchema);

export default Contact; 