import mongoose from "mongoose";

const listingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        type: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        amenities: {
            type: [String],
            default: [],
        },
        images: {
            type: [String],
            default: [],
        },
        contactPhone: {
            type: String,
            required: true,
        },
        aadhar: {
            type: String,
            default: "",
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        status: {
            type: String,
            default: "Available",
            enum: ["Available", "Booked"],
        },
        bookedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        bookingDate: {
            type: Date,
        },
        moveInDate: {
            type: Date,
        },
        duration: {
            type: Number,
        },
        guests: {
            type: Number,
        },
        tenantName: {
            type: String,
        },
        tenantEmail: {
            type: String,
        },
        tenantPhone: {
            type: String,
        },
        lifestyle: {
            smoking: { type: Boolean, default: false },
            drinking: { type: Boolean, default: false },
            petFriendly: { type: Boolean, default: false },
            dietary: { type: String, enum: ["Veg", "Non-Veg", "Vegan", "Any"], default: "Any" },
            cleanliness: { type: String, enum: ["Strict", "Moderate", "Relaxed"], default: "Moderate" },
        },
    },
    {
        timestamps: true,
    }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
