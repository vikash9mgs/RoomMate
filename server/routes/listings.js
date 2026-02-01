import express from "express";
import Listing from "../models/Listing.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
router.post("/", protect, async (req, res) => {
    const { type, title, description, price, location, amenities, images, contactPhone, aadhar, latitude, longitude } = req.body;

    try {
        const listing = new Listing({
            user: req.user._id,
            type,
            title,
            description,
            price,
            location,
            amenities,
            images,
            contactPhone,
            aadhar,
            latitude,
            longitude,
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
router.get("/", async (req, res) => {
    try {
        const listings = await Listing.find({}).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user's listings
// @route   GET /api/listings/my-listings
// @access  Private
router.get("/my-listings", protect, async (req, res) => {
    try {
        const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("user", "name email profilePicture");
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: "Listing not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner or Admin)
router.delete("/:id", protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Check if user is owner or admin
        if (listing.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: "Not authorized to delete this listing" });
        }

        await listing.deleteOne();
        res.json({ message: "Listing removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private (Owner or Admin)
router.put("/:id", protect, async (req, res) => {
    const { type, title, description, price, location, amenities, images, contactPhone, aadhar, latitude, longitude } = req.body;

    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        // Check if user is owner or admin
        if (listing.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: "Not authorized to update this listing" });
        }

        listing.type = type || listing.type;
        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.price = price || listing.price;
        listing.location = location || listing.location;
        listing.amenities = amenities || listing.amenities;
        listing.images = images || listing.images;
        listing.contactPhone = contactPhone || listing.contactPhone;
        listing.aadhar = aadhar || listing.aadhar;
        listing.latitude = latitude || listing.latitude;
        listing.longitude = longitude || listing.longitude;

        const updatedListing = await listing.save();
        res.json(updatedListing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Schedule a tour
// @route   POST /api/listings/:id/tour
// @access  Public
router.post("/:id/tour", async (req, res) => {
    const { fullName, phone, tourDate } = req.body;

    if (!fullName || !phone || !tourDate) {
        return res.status(400).json({ message: "Please fill in all required fields." });
    }

    try {
        const listing = await Listing.findById(req.params.id).populate("user");

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const owner = listing.user;

        if (!owner || !owner.email) {
            return res.status(404).json({ message: "Owner email not found" });
        }

        // Check for environment variables
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("Missing EMAIL_USER or EMAIL_PASS in .env file");
            return res.status(500).json({
                message: "Server configuration error: Missing email credentials."
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"RoomMate Tour Request" <${process.env.EMAIL_USER}>`,
            to: owner.email,
            subject: `New Tour Request for: ${listing.title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #0d6efd; margin: 0;">RoomMate</h2>
                        <p style="color: #6c757d; margin: 5px 0 0;">New Tour Request</p>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <p style="font-size: 16px; color: #333;">Hello <strong>${owner.name}</strong>,</p>
                        <p style="font-size: 16px; color: #555;">You have received a new tour request for your listing: <strong>${listing.title}</strong>.</p>
                        
                        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #333;">Requester Details</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; width: 30%; font-weight: bold; color: #333;">Name:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Phone:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; color: #333;">Preferred Date:</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #555;">${tourDate}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 20px; text-align: center;">
                            <a href="tel:${phone}" style="background-color: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Call Requester</a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
                        <p>This email was sent from the RoomMate platform.</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Tour request sent successfully!" });
    } catch (error) {
        console.error("Error sending tour request:", error);
        res.status(500).json({ message: "Failed to send tour request" });
    }
});

// @desc    Book a listing
// @route   POST /api/listings/:id/book
// @access  Private
router.post("/:id/book", protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate("user"); // Populate owner details

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        if (listing.status === "Booked") {
            return res.status(400).json({ message: "This listing is already booked" });
        }

        const { moveInDate, duration, guests, tenantName, tenantEmail, tenantPhone } = req.body;

        listing.status = "Booked";
        listing.bookedBy = req.user._id;
        listing.bookingDate = new Date();
        listing.moveInDate = moveInDate;
        listing.duration = duration;
        listing.guests = guests;
        listing.tenantName = tenantName || req.user.name;
        listing.tenantEmail = tenantEmail || req.user.email;
        listing.tenantPhone = tenantPhone || req.user.phone;

        const updatedListing = await listing.save();

        // Send email to owner
        if (listing.user && listing.user.email) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: `"RoomMate" <${process.env.EMAIL_USER}>`,
                to: listing.user.email,
                subject: `Your Room "${listing.title}" has been Booked!`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
                        <h2 style="color: #0d6efd; text-align: center;">New Booking Notification</h2>
                        <p>Hello ${listing.user.name},</p>
                        <p>Great news! Your listing <strong>${listing.title}</strong> has just been booked.</p>
                        
                        <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 20px;">
                            <h3 style="margin-top: 0; color: #333;">Tenant Details</h3>
                            <p><strong>Name:</strong> ${listing.tenantName}</p>
                            <p><strong>Email:</strong> ${listing.tenantEmail}</p>
                            <p><strong>Phone:</strong> ${listing.tenantPhone}</p>
                            <p><strong>Move-in Date:</strong> ${new Date(moveInDate).toLocaleDateString()}</p>
                            <p><strong>Duration:</strong> ${duration} months</p>
                            <p><strong>Guests:</strong> ${guests}</p>
                        </div>

                        <p>Please contact the tenant to finalize the move-in arrangements.</p>
                        <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                            &copy; ${new Date().getFullYear()} RoomMate. All rights reserved.
                        </p>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        }

        res.json(updatedListing);
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
