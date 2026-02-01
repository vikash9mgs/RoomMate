import express from "express";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use Gemini chatbot route
app.use("/api", chatbotRoutes);
app.use("/api/auth", authRoutes); // ✅ Auth routes
app.use("/api/listings", listingRoutes); // ✅ Listing routes
app.use("/api/contact", contactRoutes); // ✅ Contact routes
app.use("/api/upload", uploadRoutes); // ✅ Upload routes

const __dirname1 = path.resolve();
app.use("/uploads", express.static(path.join(__dirname1, "/uploads")));

app.get("/", (req, res) => {
  res.send("RoomMate Gemini backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Server restarted to load env vars (Attempt 4)
