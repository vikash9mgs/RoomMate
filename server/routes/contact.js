import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Please fill in all required fields." });
    }

    // Check for environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing EMAIL_USER or EMAIL_PASS in .env file");
        return res.status(500).json({
            message: "Server configuration error: Missing email credentials. Please check server logs."
        });
    }

    console.log("Attempting to send email with user:", process.env.EMAIL_USER);

    try {
        // Create a transporter using SMTP
        // You need to add EMAIL_USER and EMAIL_PASS to your .env file
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your app password
            },
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${email}>`, // Sender address
            to: "akcollegeuse2025@gmail.com", // Receiver address
            subject: `New Contact Form Submission from ${name}`,
            text: `
        You have received a new message from the RoomMate Contact Form.
        
        Details:
        -------------------------
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        
        Message:
        ${message}
        -------------------------
      `,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #0d6efd; margin: 0;">RoomMate</h2>
                <p style="color: #6c757d; margin: 5px 0 0;">New Contact Form Submission</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #333;">Name:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Email:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Phone:</td>
                        <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${phone || "Not provided"}</td>
                    </tr>
                </table>
                
                <div style="margin-top: 20px;">
                    <p style="font-weight: bold; color: #333; margin-bottom: 10px;">Message:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #0d6efd; color: #555; line-height: 1.6;">
                        ${message.replace(/\n/g, "<br>")}
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                <p>This email was sent from the RoomMate website contact form.</p>
            </div>
        </div>
      `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        // Return the actual error message for debugging
        res.status(500).json({ message: `Failed to send message: ${error.message}` });
    }
});

export default router;
