import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Listing from "../models/Listing.js";

const router = express.Router();

const API_KEY_Gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
if (!API_KEY_Gemini) {
  console.warn("⚠️  GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Chatbot requests will fail until you set the key in server/.env.");
}

let genAI = null;
if (API_KEY_Gemini) {
  genAI = new GoogleGenerativeAI(API_KEY_Gemini);
}

router.post("/ask", async (req, res) => {
  try {
    if (!API_KEY_Gemini || !genAI) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY not configured on the server.',
        hint: 'Set GEMINI_API_KEY (or GOOGLE_API_KEY) in server/.env and restart the server.',
      });
    }

    const { prompt } = req.body;
    const userPrompt = prompt || "Hello";

    console.log("🟢 Received prompt:", userPrompt);

    // Fetch listings for context
    const listings = await Listing.find({ status: "Available" })
      .select('title type description price location amenities contactPhone')
      .limit(20)
      .lean();

    const listingsContext = listings.map(l =>
      `- ${l.type}: ${l.title} in ${l.location} for ₹${l.price}. ${l.description}. Contact: ${l.contactPhone}`
    ).join("\n");

    const systemInstruction = `You are the professional AI Assistant for "RoomMate", a premium platform connecting users with roommates, rooms, coliving spaces, and PGs.

    Here is the live data index of currently available listings:
    ${listingsContext}

    Your Role:
    - Act as a professional, knowledgeable, and helpful real estate assistant.
    - Provide accurate details regarding **Price**, **Location**, **Availability**, and **Amenities** based ONLY on the provided listings.
    - If a user asks for a room in a specific location (e.g., "Bangalore"), check the listings and provide the best matches.
    - If no relevant listings are found, politely inform the user and ask for more specific preferences or offer to help with general questions.
    - Format your responses clearly. You can use bullet points for multiple options.
    - Maintain a polished, polite, and engaging tone.
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent(userPrompt);
    const reply = result?.response?.text?.() || "⚠️ No response text generated.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);

    // --- FALLBACK LOGIC ---
    // If API fails (Quota exceeded / 429 / 500), perform a local keyword search.
    try {
      console.log("⚠️ Switching to Local Fallback Search...");

      const { prompt } = req.body;
      const lowerPrompt = (prompt || "").toLowerCase();

      // 1. Handle Greetings & General Conversation
      const greetings = ['hi', 'hello', 'hey', 'start', 'help', 'assist'];
      if (greetings.some(g => lowerPrompt.includes(g))) {
        return res.json({
          reply: "Hello! 👋\n\nI am the RoomMate Assistant. I can help you find:\n- 🏠 Rooms & Flatmates\n- 🏢 PGs & Coliving Spaces\n\n**Try asking:**\n- \"PG in Whitefield\"\n- \"Rooms in Bangalore\"\n- \"Show me listings\""
        });
      }

      // 2. Fetch Listings for Search
      const listings = await Listing.find({ status: "Available" })
        .select('title type description price location amenities contactPhone')
        .limit(50)
        .lean();

      // 3. Simple Keyword Matching
      const matches = listings.filter(l => {
        const text = `${l.title} ${l.location} ${l.description} ${l.type}`.toLowerCase();

        // Split prompt into words, filter out common stop words if needed, but for now simple length check
        // Also allow matching locations directy
        const words = lowerPrompt.split(/\s+/).filter(w => w.length > 3);

        if (words.length === 0) return text.includes(lowerPrompt);
        return words.some(w => text.includes(w));
      });

      if (matches.length > 0) {
        const topMatches = matches.slice(0, 3);
        let fallbackReply = "Here are some top matches I found locally:\n\n";

        topMatches.forEach(l => {
          fallbackReply += `🏠 **${l.type}** in **${l.location}**\n`;
          fallbackReply += `💰 ₹${l.price}/month\n`;
          fallbackReply += `📞 ${l.contactPhone}\n`;
          fallbackReply += `📍 ${l.title}\n\n`;
        });

        fallbackReply += "Use distinct keywords like 'Whitefield' or 'PG' to refine results.";

        return res.json({ reply: fallbackReply });
      } else {
        return res.json({
          reply: "I couldn't find any specific listings matching that description right now. \n\n**Try searching by location or type:**\n- \"Whitefield\"\n- \"HSR Layout\"\n- \"PG for ladies\"\n- \"Single room\""
        });
      }

    } catch (fallbackError) {
      console.error("❌ Fallback also failed:", fallbackError);

      res.status(500).json({
        error: 'Service temporarily unavailable.',
        hint: 'Please try again later.',
      });
    }
  }
});

export default router;
