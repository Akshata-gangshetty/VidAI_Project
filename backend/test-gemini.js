import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
    console.log("Testing Gemini API...");
    console.log("Model: gemini-3.8-flash");

    try {
        const response = await Promise.race([
            ai.models.generateContent({
                model: "gemini-3.8-flash",
                contents: "Say hello in one sentence."
            }),
            new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error("Request timed out after 30 seconds")),
                    30000
                )
            )
        ]);

        console.log("SUCCESS! Gemini model is working.");
        console.log("Response:", response.text);

    } catch (error) {
        console.error("Gemini test failed:");
        console.error(error.message);
    }
}

testGemini();