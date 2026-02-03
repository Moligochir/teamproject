"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPostNotification = sendPostNotification;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});
async function sendPostNotification(title, content) {
    try {
        await transporter.sendMail({
            from: `"Website Notifications" <${process.env.ADMIN_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: "New Post Submitted",
            text: `A new post was created:\n\nTitle: ${title}\n\nContent:\n${content}`, // Plain text fallback
            html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Post Notification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          📝 New Post Submitted
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                          A new post has been created on your website:
                        </p>
                        
                        <!-- Title Section -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                              <p style="margin: 0 0 8px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                                TITLE
                              </p>
                              <h2 style="margin: 0; color: #333333; font-size: 24px; font-weight: bold; line-height: 1.4;">
                                ${title}
                              </h2>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Content Section -->
                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                          <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #764ba2; border-radius: 4px;">
                              <p style="margin: 0 0 8px; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">
                                CONTENT
                              </p>
                              <div style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                                ${content}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="margin: 0; color: #999999; font-size: 14px;">
                          This is an automated notification from your website.
                        </p>
                        <p style="margin: 10px 0 0; color: #999999; font-size: 14px;">
                          © ${new Date().getFullYear()} Your Website. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
        });
        return true; // success
    }
    catch (error) {
        console.error("Failed to send email:", error);
        return false; // failed
    }
}
