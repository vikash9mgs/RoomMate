import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from multiple files (try .env.local then .env).
// Must run before importing modules that read process.env during their top-level evaluation.
dotenv.config({ path: [".env.local", ".env"] });

// Import routes after dotenv has populated process.env so route modules see the variables.
const chatbotRoutesModule = await import("./routes/chatbot.js"); // top-level await (ESM)
const chatbotRoutes = chatbotRoutesModule.default; // ✅ Gemini route import
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listings.js"; // ✅ Listing routes import
import contactRoutes from "./routes/contact.js"; // ✅ Contact routes import
import uploadRoutes from "./routes/upload.js";
import { setupCallHandler } from "./socket/callHandler.js"; // ✅ Voice call signaling
import callHistoryRoutes from "./routes/callHistory.js"; // ✅ Call history REST API

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

// ── CORS: allow Vercel frontend in production, localhost in dev ────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5174",
  "http://localhost:5174",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

// ✅ Use Gemini chatbot route
app.use("/api", chatbotRoutes);
app.use("/api/auth", authRoutes); // ✅ Auth routes
app.use("/api/listings", listingRoutes); // ✅ Listing routes
app.use("/api/contact", contactRoutes); // ✅ Contact routes
app.use("/api/upload", uploadRoutes); // ✅ Upload routes
app.use("/api/call-history", callHistoryRoutes); // ✅ Call history

const __dirname1 = path.resolve();
app.use("/uploads", express.static(path.join(__dirname1, "/uploads")));

app.get("/", (req, res) => {
  res.send("RoomMate Gemini backend is running 🚀");
});

// ✅ Create HTTP server and attach Socket.IO (shares the same port as Express)
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Wire up voice call signaling events
setupCallHandler(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT} with Socket.IO 🚀`));
