import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const testEmail = async () => {
    console.log("Testing email configuration...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    // Do not print the full password, just the length
    console.log("EMAIL_PASS length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "0");

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: "Test Email from RoomMate",
            text: "If you see this, the email configuration is working!",
        });
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending email:");
        console.error(error.message);
        if (error.response) {
            console.error("SMTP Response:", error.response);
        }
    }
};

testEmail();
