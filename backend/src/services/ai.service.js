import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateStudyMaterial = async (transcript) => {
    if (!transcript || typeof transcript !== "string") {
        throw new Error("A valid transcript is required");
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
You are an AI educational assistant for VidAI.

Analyze this educational video transcript and generate study material.

Return valid JSON with this structure:

{
  "summary": "A concise summary",
  "importantTopics": ["Topic 1", "Topic 2"],
  "studyNotes": "Detailed revision notes",
  "importantQuestions": ["Question 1", "Question 2"],
  "quiz": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Exact correct option",
      "explanation": "Explanation of the answer"
    }
  ]
}

Requirements:
- Generate a clear summary.
- Identify the important concepts.
- Create useful revision notes.
- Generate five important questions.
- Generate five multiple-choice questions.
- Each quiz must have four options.
- The correct answer must match one of the options.
- Use information supported by the transcript.
- Return JSON only.

TRANSCRIPT:
${transcript}
        `,
        config: {
            responseMimeType: "application/json"
        }
    });

    const text = response.text;

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    let result;

    try {
        result = JSON.parse(text);
    } catch {
        throw new Error("Gemini returned invalid JSON");
    }

    if (
        typeof result.summary !== "string" ||
        !Array.isArray(result.importantTopics) ||
        typeof result.studyNotes !== "string" ||
        !Array.isArray(result.importantQuestions) ||
        !Array.isArray(result.quiz)
    ) {
        throw new Error("Gemini returned an invalid response structure");
    }

    return result;
};