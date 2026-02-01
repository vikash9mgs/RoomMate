import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";
import connectDB from "./config/db.js";

dotenv.config();

const clearAndReseed = async () => {
    try {
        await connectDB();

        // Clear all existing listings
        const deleteResult = await Listing.deleteMany({});
        console.log(`✅ Deleted ${deleteResult.deletedCount} existing listings`);

        console.log("\n🌱 Now run: node seedListings.js to add new category-based listings");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing listings:", error);
        process.exit(1);
    }
};

clearAndReseed();
