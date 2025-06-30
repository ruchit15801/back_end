import nodemailer from 'nodemailer'
import config from 'config'

const mail: any = config.get('nodeMail')
// console.log(mail);

const option = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: mail.mail,
        pass: mail.password
    }
}
const transporter = nodemailer.createTransport(option);

export const signUp_verification_mail = async (mail_data: any) => {
    try {
        return new Promise(async (resolve, reject) => {
            const mailOption = {
                from: mail.mail,
                to: mail_data?.email,
                subject: "Gpt Officer Otp Here",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Gpt Officer OTP</title>
                    <meta name="description" content="Gpt Officer SignUp Otp.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                    <h1 > Gpt Officer</h1>
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:600; margin:0;font-size:25px;font-family:'Rubik',sans-serif;">
                                                            Otp Verification</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:10px 0 26px 0; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
                                                            Hi Dear,
                                                            <br><br>
                                                            Thank you for using Gpt Officer. Your Otp is <span style="font-weight:700; color: #1e1e2d;">${mail_data.otp} </span> for <span style="font-weight:700; color: #1e1e2d;">${mail_data.email} </span>. Please keep this information secure.
                                                            <br><br>
                                                            Thanks & Regards<br>
                                                            Team Gpt Officer
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                          </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            }
            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instruction`);
                }
            })
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const forgotPassword_mail = async (mail_data: any) => {
    try {
        return new Promise(async (resolve, reject) => {
            const mailOption = {
                from: mail.mail,
                to: mail_data?.email,
                subject: "Gpt Officer ForgotPassword OTP Here",
                html: `<html lang="en-US">
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Gpt Officer OTP</title>
                    <meta name="description" content="Gpt Officer OTP.">
                    <style type="text/css">
                        a:hover {
                            text-decoration: underline !important;
                        }
                    </style>
                </head>
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                    <h1 > Fit Flush</h1>
    
                                                        <h1
                                                            style="color:#1e1e2d; font-weight:600; margin:0;font-size:25px;font-family:'Rubik',sans-serif;">
                                                            OTP Verification</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:10px 0 26px 0; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p
                                                            style="color:#455056; font-size:15px;line-height:24px;text-align:left; margin:0;">
                                                            Hi <span style="font-weight:600; color: #1e1e2d;">${mail_data.name}</span>,
                                                            <br><br>
                                                            Your Verification OTP For Gpt Officer is <span style="font-weight:700; color: #1e1e2d;">${mail_data.otp}. </span>Please keep this information secure.
                                                            <br><br>
                                                            Thanks & Regards<br>
                                                            Team Gpt Officer
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                          </tr>
                        </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                </body>
                
                </html>`,
            }
            transporter.sendMail(mailOption, (err, data) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve(`Email has been sent to ${mail_data?.email}, kindly follow the instruction`);
                }
            })
        })
    }
    catch (error) {
        console.log(error)
    }
}
