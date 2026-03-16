import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels using the client instance usually, let's try the model.
        // Actually the SDK doesn't expose listModels easily on the instance.
        // It is usually not needed if we know the name.

        // Let's try to just run a generation with gemini-pro.
        console.log("Trying gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const resultPro = await modelPro.generateContent("Test");
        console.log("gemini-pro response:", resultPro.response.text());

        console.log("Trying gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const resultFlash = await modelFlash.generateContent("Test");
        console.log("gemini-1.5-flash response:", resultFlash.response.text());

    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
