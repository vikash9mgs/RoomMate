import express from "express";
import CallHistory from "../models/CallHistory.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT token
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Token invalid" });
    }
};

// GET /api/call-history — returns call history for the authenticated user
router.get("/", protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const history = await CallHistory.find({
            $or: [{ callerId: userId }, { receiverId: userId }],
        })
            .populate("callerId", "name email profilePicture")
            .populate("receiverId", "name email profilePicture")
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(history);
    } catch (err) {
        console.error("[CallHistory] Error fetching:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
