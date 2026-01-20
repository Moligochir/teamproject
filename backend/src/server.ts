import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

export async function sendPostNotification(title: string, content: string): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: `"Website Notifications" <${process.env.ADMIN_EMAIL}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "New Post Submitted",
        text: `A new post was created:\n\nTitle: ${title}\n\nContent:\n${content}`
      });
      return true; // success
    } catch (error) {
      console.error("Failed to send email:", error);
      return false; // failed
    }
  }
