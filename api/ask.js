import connectToDatabase from './_db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Listing from '../server/models/Listing.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await connectToDatabase();

  const API_KEY_Gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!API_KEY_Gemini) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server.' });
  }

  const genAI = new GoogleGenerativeAI(API_KEY_Gemini);

  const { prompt } = req.body || {};
  try {
    const listings = await Listing.find({ status: 'Available' })
      .select('title type description price location amenities contactPhone')
      .limit(20)
      .lean();

    const listingsContext = listings.map(l => `- ${l.type}: ${l.title} in ${l.location} for ₹${l.price}. ${l.description}. Contact: ${l.contactPhone}`).join('\n');

    const systemInstruction = `You are the professional AI Assistant for "RoomMate". Here is the live data index of currently available listings:\n${listingsContext}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest', systemInstruction });
    const result = await model.generateContent(prompt || 'Hello');
    const reply = result?.response?.text?.() || 'No response';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error.message);
    // Local fallback
    try {
      const { prompt } = req.body || {};
      const lowerPrompt = (prompt || '').toLowerCase();
      const listings = await Listing.find({ status: 'Available' }).select('title type description price location contactPhone').limit(50).lean();
      const matches = listings.filter(l => (l.title + ' ' + l.location + ' ' + l.description + ' ' + l.type).toLowerCase().includes(lowerPrompt));
      if (matches.length > 0) {
        const top = matches.slice(0,3);
        let reply = 'Here are some matches:\n\n';
        top.forEach(m => { reply += `- ${m.type} in ${m.location}: ${m.title} - ₹${m.price} (Contact: ${m.contactPhone})\n`; });
        return res.json({ reply });
      }
      return res.json({ reply: 'No matches found. Try a location or type.' });
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError);
      return res.status(500).json({ error: 'Service temporarily unavailable.' });
    }
  }
}
