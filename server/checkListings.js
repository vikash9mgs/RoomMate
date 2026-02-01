import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './models/Listing.js';

dotenv.config({ path: [".env.local", ".env"] });

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/roommate');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const check = async () => {
    await connectDB();
    const count = await Listing.countDocuments();
    console.log(`Total Listings: ${count}`);
    const available = await Listing.countDocuments({ status: "Available" });
    console.log(`Available Listings: ${available}`);
    if (available > 0) {
        const example = await Listing.findOne({ status: "Available" });
        console.log("Example Listing:", example.title, "Location:", example.location);
    }
    process.exit();
};

check();
