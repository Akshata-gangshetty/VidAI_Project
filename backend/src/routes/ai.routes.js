import { Router } from "express";

import {
    generateAiContent,
    getAiContent,
    updateAiContent
} from "../controllers/ai.controller.js";

import { verifyJWt } from "../middlrwares/auth.middleware.js";

const router = Router();

// All AI routes require authentication
router.use(verifyJWt);

// Generate AI study material
router.post(
    "/:videoId/generate",
    generateAiContent
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