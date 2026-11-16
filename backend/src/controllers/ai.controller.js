import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { video as VideoModel } from "../models/video.model.js";
import { AiContent } from "../models/aiConnect.model.js";

import { generateStudyMaterial } from "../services/ai.service.js";


// Generate AI study material from a manually provided transcript
const generateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { transcript } = req.body;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (
        typeof transcript !== "string" ||
        !transcript.trim()
    ) {
        throw new ApiError(400, "Transcript is required");
    }

    if (transcript.length > 50000) {
        throw new ApiError(
            413,
            "Transcript is too long. Please provide a shorter transcript."
        );
    }

    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Educational video not found");
    }

    if (String(videoItem.owner) !== String(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to generate content for this video"
        );
    }

    let aiContent = await AiContent.findOne({
        video: videoId
    });

    if (!aiContent) {
        aiContent = new AiContent({
            video: videoId,
            transcript: transcript.trim(),
            status: "processing"
        });
    } else {
        aiContent.transcript = transcript.trim();
        aiContent.status = "processing";
    }

    aiContent.errorMessage = "";
    await aiContent.save();

    try {
        const generatedContent = await generateStudyMaterial(
            transcript.trim()
        );

        aiContent.summary = generatedContent.summary;
        aiContent.importantTopics =
            generatedContent.importantTopics;
        aiContent.studyNotes = generatedContent.studyNotes;
        aiContent.importantQuestions =
            generatedContent.importantQuestions;
        aiContent.quiz = generatedContent.quiz;
        aiContent.status = "completed";

        await aiContent.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                aiContent,
                "AI study material generated successfully"
            )
        );
    } catch (error) {
        aiContent.status = "failed";
        aiContent.errorMessage =
            error.message || "AI content generation failed";

        await aiContent.save();

        throw error;
    }
});


// Automatically transcribe video and generate AI study material
const transcribeAndGenerateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // 1. Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 2. Find video
    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Educational video not found");
    }

    // 3. Check video ownership
    if (String(videoItem.owner) !== String(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to generate content for this video"
        );
    }

    // 4. Check video URL
    if (!videoItem.videofile) {
        throw new ApiError(400, "Video file URL not found");
    }

    // 5. Find or create AI content
    let aiContent = await AiContent.findOne({
        video: videoId
    });

    if (!aiContent) {
        aiContent = new AiContent({
            video: videoId,
            status: "processing"
        });
    } else {
        aiContent.status = "processing";
    }

    aiContent.errorMessage = "";
    await aiContent.save();

    try {
        // 6. Call Python FastAPI service
        const transcriptionResponse = await fetch(
            process.env.TRANSCRIPTION_SERVICE_URL ||
            "http://127.0.0.1:8001/transcribe",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-transcription-key":
                        process.env.TRANSCRIPTION_API_KEY
                },
                body: JSON.stringify({
                    videoUrl: videoItem.videofile
                }),
                signal: AbortSignal.timeout(30 * 60 * 1000)
            }
        );

        // 7. Check Python response
        if (!transcriptionResponse.ok) {
    const errorText = await transcriptionResponse.text();

    throw new Error(
        `Transcription service error (${transcriptionResponse.status}): ${errorText}`
    );
}

        // 8. Extract transcript
        const transcriptionData =
            await transcriptionResponse.json();

        const transcript = transcriptionData.transcript;

        if (
            typeof transcript !== "string" ||
            !transcript.trim()
        ) {
            throw new Error("No transcript received from Python service");
        }

        if (transcript.length > 50000) {
            throw new Error(
                "Transcript is too long for AI content generation"
            );
        }

        // 9. Save transcript
        aiContent.transcript = transcript.trim();
        await aiContent.save();

        // 10. Generate study material using Gemini
        const generatedContent = await generateStudyMaterial(
            transcript.trim()
        );

        // 11. Save generated content
        aiContent.summary = generatedContent.summary;
        aiContent.importantTopics =
            generatedContent.importantTopics;
        aiContent.studyNotes = generatedContent.studyNotes;
        aiContent.importantQuestions =
            generatedContent.importantQuestions;
        aiContent.quiz = generatedContent.quiz;
        aiContent.status = "completed";

        await aiContent.save();

        // 12. Return response
        return res.status(200).json(
            new ApiResponse(
                200,
                aiContent,
                "Video transcribed and AI study material generated successfully"
            )
        );

    } catch (error) {
        aiContent.status = "failed";
        aiContent.errorMessage =
            error.message || "Transcription or AI generation failed";

        await aiContent.save();

        throw error;
    }
});


// Retrieve AI content for a video
const getAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Video not found");
    }

    const isOwner =
        String(videoItem.owner) === String(req.user._id);

    if (!videoItem.isPublished && !isOwner) {
        throw new ApiError(
            403,
            "You cannot access content for this video"
        );
    }

    const aiContent = await AiContent.findOne({
        video: videoId
    });

    if (!aiContent) {
        throw new ApiError(404, "AI content not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            aiContent,
            "AI content fetched successfully"
        )
    );
});


// Update existing AI content
const updateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Video not found");
    }

    if (String(videoItem.owner) !== String(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to update this AI content"
        );
    }

    const aiContent = await AiContent.findOne({
        video: videoId
    });

    if (!aiContent) {
        throw new ApiError(404, "AI content not found");
    }

    const {
        transcript,
        summary,
        importantTopics,
        importantQuestions,
        studyNotes,
        quiz
    } = req.body;

    if (
        transcript !== undefined &&
        (typeof transcript !== "string" || transcript.length > 50000)
    ) {
        throw new ApiError(400, "Invalid transcript");
    }

    if (
        summary !== undefined &&
        typeof summary !== "string"
    ) {
        throw new ApiError(400, "Invalid summary");
    }

    if (
        importantTopics !== undefined &&
        !Array.isArray(importantTopics)
    ) {
        throw new ApiError(400, "Important topics must be an array");
    }

    if (
        importantQuestions !== undefined &&
        !Array.isArray(importantQuestions)
    ) {
        throw new ApiError(400, "Important questions must be an array");
    }

    if (
        studyNotes !== undefined &&
        typeof studyNotes !== "string"
    ) {
        throw new ApiError(400, "Study notes must be a string");
    }

    if (quiz !== undefined && !Array.isArray(quiz)) {
        throw new ApiError(400, "Quiz must be an array");
    }

    if (transcript !== undefined) aiContent.transcript = transcript;
    if (summary !== undefined) aiContent.summary = summary;

    if (importantTopics !== undefined) {
        aiContent.importantTopics = importantTopics;
    }

    if (importantQuestions !== undefined) {
        aiContent.importantQuestions = importantQuestions;
    }

    if (studyNotes !== undefined) aiContent.studyNotes = studyNotes;
    if (quiz !== undefined) aiContent.quiz = quiz;

    await aiContent.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            aiContent,
            "AI content updated successfully"
        )
    );
});


export {
    generateAiContent,
    transcribeAndGenerateAiContent,
    getAiContent,
    updateAiContent
};