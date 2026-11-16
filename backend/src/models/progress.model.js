import mongoose, { Schema } from "mongoose";

const quizHistorySchema = new Schema(
  {
    quizScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const progressSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "video",
      required: true,
    },

    // Video learning progress
    watchPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completionDate: {
      type: Date,
      default: null,
    },

    lastWatchedAt: {
      type: Date,
      default: Date.now,
    },

    // Latest quiz performance
    quizScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    quizAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastWatchedPosition:{
      type:Number,
      default:0,

    },

    // History of individual quiz attempts
    quizHistory: {
      type: [quizHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// One progress document per user per video
progressSchema.index(
  { user: 1, video: 1 },
  { unique: true }
);

export const Progress = mongoose.model(
  "Progress",
  progressSchema
);