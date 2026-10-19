import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { video as VideoModel } from "../models/video.model.js";
import { AiContent } from "../models/aiConnect.model.js";

import { generateStudyMaterial } from "../services/ai.service.js";

// Generate AI study material from a video transcript
const generateAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { transcript } = req.body;

    // 1. Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 2. Validate transcript
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

    // 3. Find the video
    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Educational video not found");
    }

    // 4. Verify that the authenticated user owns the video
    if (String(videoItem.owner) !== String(req.user._id)) {
        throw new ApiError(
            403,
            "You are not authorized to generate content for this video"
        );
    }

    // 5. Find existing AI content
    let aiContent = await AiContent.findOne({
        video: videoId
    });

    // 6. Create or update the content document
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
        // 7. Generate content using Gemini
        const generatedContent = await generateStudyMaterial(
            transcript.trim()
        );

        // 8. Save the generated content
        aiContent.summary = generatedContent.summary;
        aiContent.importantTopics =
            generatedContent.importantTopics;
        aiContent.studyNotes = generatedContent.studyNotes;
        aiContent.importantQuestions =
            generatedContent.importantQuestions;
        aiContent.quiz = generatedContent.quiz;
        aiContent.status = "completed";

        await aiContent.save();

        // 9. Return the generated content
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


// Retrieve AI content for a video
const getAiContent = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // 1. Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 2. Find the video
    const videoItem = await VideoModel.findById(videoId);

    if (!videoItem) {
        throw new ApiError(404, "Video not found");
    }

    // 3. Allow the owner or a student to access published videos
    const isOwner =
        String(videoItem.owner) === String(req.user._id);

    if (!videoItem.isPublished && !isOwner) {
        throw new ApiError(
            403,
            "You cannot access content for this video"
        );
    }

    // 4. Find generated content
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

    // Only the video owner can update its AI content
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

    // Validate the supplied fields
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

    // Update only the fields explicitly allowed above
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

    // Do not allow clients to set status directly
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
    getAiContent,
    updateAiContent
};