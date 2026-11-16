import { Router } from "express";

import {
    generateAiContent,
    transcribeAndGenerateAiContent,
    getAiContent,
    updateAiContent
} from "../controllers/ai.controller.js";

import { verifyJWt } from "../middlrwares/auth.middleware.js";

const router = Router();

// All AI routes require authentication
router.use(verifyJWt);

// Generate AI study material from a manual transcript
router.post(
    "/:videoId/generate",
    generateAiContent
);

// Automatically transcribe video and generate AI study material
router.post(
    "/:videoId/transcribe",
    transcribeAndGenerateAiContent
);

// Retrieve AI study material
router.get(
    "/:videoId",
    getAiContent
);

// Update AI study material
router.patch(
    "/:videoId",
    updateAiContent
);

export default router;