
import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const addLucknowListing = async () => {
    try {
        await connectDB();

        // Find a user to assign listings to
        const user = await User.findOne();
        if (!user) {
            console.log("No user found. Please create a user first.");
            process.exit(1);
        }

        const lucknowListing = {
            user: user._id,
            title: "Cozy Room in Gomti Nagar",
            type: "Room",
            description: "Well-furnished single room in a peaceful locality. Close to parks and markets. Perfect for students or working professionals.",
            price: 6000,
            location: "Gomti Nagar, Lucknow",
            amenities: ["WiFi", "AC", "Attached Bathroom", "Parking", "Power Backup"],
            images: ["https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800"], // Reusing a nice room image
            contactPhone: "9876543299",
            latitude: 26.8500,
            longitude: 80.9499,
        };

        const createdListing = await Listing.create(lucknowListing);
        console.log("Lucknow listing added successfully:", createdListing.title);
        process.exit();
    } catch (error) {
        console.error("Error adding listing:", error);
        process.exit(1);
    }
};

addLucknowListing();
