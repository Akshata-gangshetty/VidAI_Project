import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export const generateStudyMaterial = async (transcript) => {

    // 1. Validate transcript
    if (
        typeof transcript !== "string" ||
        !transcript.trim()
    ) {
        throw new Error("A valid transcript is required");
    }

    if (transcript.length > 50000) {
        throw new Error("Transcript is too long");
    }

    // 2. Generate study material using Gemini
    const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",

        contents: `
You are an AI educational assistant for VidAI.

Analyze the following educational video transcript.

Generate study material in valid JSON format using this structure:

{
    "summary": "A concise summary",
    "importantTopics": ["Topic 1", "Topic 2"],
    "studyNotes": "Detailed revision notes",
    "importantQuestions": ["Question 1", "Question 2"],
    "quiz": [
        {
            "question": "Question text",
            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],
            "correctAnswer": "Exact correct option",
            "explanation": "Explanation of the answer"
        }
    ]
}

Requirements:
- Generate a clear and meaningful summary.
- Identify important concepts.
- Create detailed revision notes.
- Generate five important questions.
- Generate five multiple-choice questions.
- Every quiz must have exactly four options.
- The correct answer must exactly match one option.
- Use only information supported by the transcript.
- Avoid duplicate questions.
- Return JSON only.

TRANSCRIPT:
${transcript}
        `,

        config: {
            responseMimeType: "application/json"
        }
    });

    // 3. Extract Gemini response
    const text = response.text;

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    // 4. Parse JSON response
    let result;

    try {
        result = JSON.parse(text);
    } catch {
        throw new Error("Gemini returned invalid JSON");
    }

    // 5. Validate response structure
    if (
        typeof result.summary !== "string" ||
        !Array.isArray(result.importantTopics) ||
        typeof result.studyNotes !== "string" ||
        !Array.isArray(result.importantQuestions) ||
        !Array.isArray(result.quiz)
    ) {
        throw new Error(
            "Gemini returned an invalid response structure"
        );
    }

    // 6. Validate quiz questions
    for (const item of result.quiz) {

        if (
            typeof item.question !== "string" ||
            !Array.isArray(item.options) ||
            item.options.length !== 4 ||
            typeof item.correctAnswer !== "string" ||
            typeof item.explanation !== "string"
        ) {
            throw new Error("Invalid quiz question structure");
        }

        if (!item.options.includes(item.correctAnswer)) {
            throw new Error(
                "Quiz correct answer does not match any option"
            );
        }
    }

    // 7. Return validated study material
    return result;
};