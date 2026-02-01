import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";
import connectDB from "./config/db.js";

dotenv.config();

const updateAllPrices = async () => {
    try {
        await connectDB();

        // Get all listings
        const listings = await Listing.find();
        console.log(`Found ${listings.length} listings to update...`);

        // Update each listing's price to be within 2000-10000 range
        for (const listing of listings) {
            let newPrice = listing.price;

            // If price is above 10000, scale it down proportionally
            if (newPrice > 10000) {
                // Scale down prices above 10000 to fit in 6000-10000 range
                newPrice = Math.floor(6000 + ((newPrice % 50000) / 50000) * 4000);
            }

            // If price is below 2000, set it to minimum range
            if (newPrice < 2000) {
                newPrice = Math.floor(2000 + (newPrice % 1000));
            }

            // Ensure price is within bounds
            newPrice = Math.max(2000, Math.min(10000, newPrice));

            listing.price = newPrice;
            await listing.save();
            console.log(`Updated "${listing.title}" from ₹${listing.price} to ₹${newPrice}`);
        }

        console.log("\n✅ All prices updated successfully to be within ₹2000-₹10000 range!");
        process.exit(0);
    } catch (error) {
        console.error("Error updating prices:", error);
        process.exit(1);
    }
};

updateAllPrices();
