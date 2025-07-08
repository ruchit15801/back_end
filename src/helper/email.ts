import * as nodemailer from 'nodemailer';
import config from 'config';

// Email configuration
const emailConfig = {
    host: config.get('email.host') || 'smtp.gmail.com',
    port: config.get('email.port') || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.get('email.user'),
        pass: config.get('email.pass')
    }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

export interface EmailData {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
}

// Send notification email to admin
export const sendContactNotificationToAdmin = async (contactData: EmailData) => {
    try {
        const adminEmail = config.get('email.adminEmail') || 'admin@pokiifuns.com';

        const mailOptions = {
            from: `"Pokiifuns Games" <${emailConfig.auth.user}>`,
            to: adminEmail,
            subject: `New Contact Form Submission: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">🎮 Pokiifuns Games</h1>
                        <p style="margin: 10px 0 0 0;">New Contact Form Submission</p>
                    </div>
                    
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
                        
                        <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                            <p><strong>Name:</strong> ${contactData.name}</p>
                            <p><strong>Email:</strong> ${contactData.email}</p>
                            <p><strong>Subject:</strong> ${contactData.subject}</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                            <h3 style="color: #333; margin-top: 0;">Message:</h3>
                            <p style="line-height: 1.6; color: #555;">${contactData.message.replace(/\n/g, '<br>')}</p>
                        </div>
                        
                        ${contactData.ipAddress ? `<p><strong>IP Address:</strong> ${contactData.ipAddress}</p>` : ''}
                        ${contactData.userAgent ? `<p><strong>User Agent:</strong> ${contactData.userAgent}</p>` : ''}
                    </div>
                    
                    <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p>This is an automated notification from Pokiifuns Games contact form.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact notification sent to admin:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending contact notification to admin:', error);
        throw error;
    }
};

// Send confirmation email to user
export const sendContactConfirmationToUser = async (contactData: EmailData) => {
    try {
        const mailOptions = {
            from: `"Pokiifuns Games" <${emailConfig.auth.user}>`,
            to: contactData.email,
            subject: `Thank you for contacting Pokiifuns Games - ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0;">🎮 Pokiifuns Games</h1>
                        <p style="margin: 10px 0 0 0;">Thank you for contacting us!</p>
                    </div>
                    
                    <div style="padding: 20px; background: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Hello ${contactData.name}!</h2>
                        
                        <p style="line-height: 1.6; color: #555;">
                            Thank you for reaching out to Pokiifuns Games. We have received your message and our team will get back to you as soon as possible.
                        </p>
                        
                        <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <h3 style="color: #333; margin-top: 0;">Your Message Details:</h3>
                            <p><strong>Subject:</strong> ${contactData.subject}</p>
                            <p><strong>Message:</strong></p>
                            <p style="background: #f5f5f5; padding: 10px; border-radius: 3px; font-style: italic;">
                                ${contactData.message.replace(/\n/g, '<br>')}
                            </p>
                        </div>
                        
                        <p style="line-height: 1.6; color: #555;">
                            We typically respond within 24-48 hours. If you have any urgent inquiries, please don't hesitate to reach out again.
                        </p>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://pokiifuns.com" style="background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Visit Pokiifuns Games
                            </a>
                        </div>
                    </div>
                    
                    <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
                        <p>© 2024 Pokiifuns Games. All rights reserved.</p>
                        <p>This is an automated response. Please do not reply to this email.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Contact confirmation sent to user:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending contact confirmation to user:', error);
        throw error;
    }
};

// Test email configuration
export const testEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email server connection verified');
        return true;
    } catch (error) {
        console.error('❌ Email server connection failed:', error);
        return false;
    }
}; 