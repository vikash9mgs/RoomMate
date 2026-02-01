import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || "user",
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                aadhar: user.aadhar,
                aadhar: user.aadhar,
                profilePicture: user.profilePicture,
                favorites: user.favorites,
                isAdmin: user.isAdmin,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log("Login attempt for:", email);
        console.log("User found:", user);

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                aadhar: user.aadhar,
                aadhar: user.aadhar,
                profilePicture: user.profilePicture,
                favorites: user.favorites,
                isAdmin: user.isAdmin,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", async (req, res) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password").populate("favorites");

            res.json(user);
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", async (req, res) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id);

            if (user) {
                user.name = req.body.name || user.name;
                user.email = req.body.email || user.email;
                user.phone = req.body.phone || user.phone;
                user.location = req.body.location || user.location;
                user.aadhar = req.body.aadhar || user.aadhar;
                if (req.body.profilePicture !== undefined) {
                    user.profilePicture = req.body.profilePicture;
                }

                if (req.body.password) {
                    user.password = req.body.password;
                }

                const updatedUser = await user.save();

                res.json({
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    location: updatedUser.location,
                    aadhar: updatedUser.aadhar,
                    profilePicture: updatedUser.profilePicture,
                    favorites: updatedUser.favorites,
                    isAdmin: updatedUser.isAdmin,
                    token: generateToken(updatedUser._id),
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

// @desc    Add listing to favorites
// @route   PUT /api/auth/favorites/:listingId
// @access  Private
router.put("/favorites/:listingId", async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const listingId = req.params.listingId;

            const updatedUser = await User.findByIdAndUpdate(
                decoded.id,
                { $addToSet: { favorites: listingId } },
                { new: true }
            ).populate("favorites");

            if (updatedUser) {
                res.json(updatedUser.favorites);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error adding favorite:", error);
            res.status(500).json({ message: "Failed to update favorites" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

// @desc    Remove listing from favorites
// @route   DELETE /api/auth/favorites/:listingId
// @access  Private
router.delete("/favorites/:listingId", async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const listingId = req.params.listingId;

            const updatedUser = await User.findByIdAndUpdate(
                decoded.id,
                { $pull: { favorites: listingId } },
                { new: true }
            ).populate("favorites");

            if (updatedUser) {
                res.json(updatedUser.favorites);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            console.error("Error removing favorite:", error);
            res.status(500).json({ message: "Failed to update favorites" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
});

export default router;
