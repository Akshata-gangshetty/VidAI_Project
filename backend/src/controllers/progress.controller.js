import { Apierror } from "../utils/ApiError.js";
import { Apiresponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { video } from "../models/video.model.js";
import { Progress } from "../models/progress.model.js";
import { AiContent } from "../models/aiConnect.model.js";

// Update video watch progress
const updateVideoProgress = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { watchPercentage, lastWatchedPosition } = req.body;

  if (
    typeof watchPercentage !== "number" ||
    !Number.isFinite(watchPercentage) ||
    watchPercentage < 0 ||
    watchPercentage > 100
  ) {
    throw new Apierror(
      400,
      "watchPercentage must be between 0 and 100"
    );
  }

  if (
    typeof lastWatchedPosition !== "number" ||
    !Number.isFinite(lastWatchedPosition) ||
    lastWatchedPosition < 0
  ) {
    throw new Apierror(400, "Invalid playback position");
  }

  const Video = await video.findById(videoId);

  if (!Video) {
    throw new Apierror(404, "Video not found");
  }

  if (lastWatchedPosition > Video.duration) {
    throw new Apierror(400, "Playback position exceeds video duration");
  }

 
  const existingProgress=await Progress.findOne({
    user: req.user._id,
      video: videoId,
  })
  const maxWatchPercentage=Math.max(existingProgress?.watchPercentage || 0,watchPercentage)
  const completed=existingProgress?.completed || maxWatchedPercentage === 100;

  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      video: videoId,
    },
    {
      $set: {
        watchPercentage,
        lastWatchedPosition,
        completed,
        lastWatchedAt: new Date(),
        ...(completed ? { completionDate: new Date() } : {}),
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new Apiresponse(
      200,
      progress,
      "Progress updated successfully"
    )
  );
});

// Get progress for one video
const getVideoProgress = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const progress = await Progress.findOne({
    user: req.user._id,
    video: videoId,
  });

  return res.status(200).json(
    new Apiresponse(
      200,
      progress,
      "Video progress fetched successfully"
    )
  );
});

// Save quiz score
const saveQuizScore = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { selectedAnswers } = req.body;

  if (
    !selectedAnswers ||
    typeof selectedAnswers !== "object" ||
    Array.isArray(selectedAnswers)
  ) {
    throw new Apierror(400, "Invalid quiz answers");
  }

  const aiContent = await AiContent.findOne({
    video: videoId,
    status: "completed",
  });

  if (!aiContent || !aiContent.quiz?.length) {
    throw new Apierror(404, "Quiz not found for this video");
  }

  const totalQuestions = aiContent.quiz.length;
  const answerIndexes = Object.keys(selectedAnswers);

  if (answerIndexes.length !== totalQuestions) {
    throw new Apierror(400, "Please answer all quiz questions");
  }

  for (const index of answerIndexes) {
    const questionIndex = Number(index);
    const studentAnswer = selectedAnswers[index];

    if (
      !Number.isInteger(questionIndex) ||
      String(questionIndex) !== index ||
      questionIndex < 0 ||
      questionIndex >= totalQuestions ||
      typeof studentAnswer !== "string" ||
      !aiContent.quiz[questionIndex].options.includes(studentAnswer)
    ) {
      throw new Apierror(400, "Invalid answer");
    }
  }

  let correctAnswers = 0;

  aiContent.quiz.forEach((question, index) => {
    const studentAnswer = selectedAnswers[index];

    if (
      studentAnswer.trim().toLowerCase() ===
      question.correctAnswer.trim().toLowerCase()
    ) {
      correctAnswers++;
    }
  });

  const score = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  const Video = await video.findById(videoId);

  if (!Video) {
    throw new Apierror(404, "Educational video not found");
  }

  const progress = await Progress.findOneAndUpdate(
    {
      user: req.user._id,
      video: videoId,
    },
    {
      $set: {
        quizScore: score,
        lastWatchedAt: new Date(),
      },
      $inc: {
        quizAttempts: 1,
      },
      $push: {
        quizHistory: {
          quizScore: score,
          attemptedAt: new Date(),
        },
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new Apiresponse(
      200,
      {
        progress,
        correctAnswers,
        totalQuestions,
        score,
        quizReview: aiContent.quiz.map((question,index)=>({
          question:question.question,
          correctAnswer:question.correctAnswer,
          explanation:question.explanation || "",
          selectedAnswer:selectedAnswers[index]
        }))
      },
      "Quiz score saved successfully"
    )
  );
});

// Get all progress for logged-in user
const getMyProgress = asyncHandler(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
  })
    .populate({
      path: "video",
      select: "title thumbnail duration",
    })
    .sort({
      updatedAt: -1,
    });

  return res.status(200).json(
    new Apiresponse(
      200,
      progress,
      "Learning progress fetched successfully"
    )
  );
});

export {
  updateVideoProgress,
  getVideoProgress,
  saveQuizScore,
  getMyProgress,
};