import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Progress} from "../models/progress.model.js";
import { video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";


const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

 
    const videos = await video.find({
        owner: userId
    }).select("_id views");


    const totalVideos = videos.length;

    const totalViews = videos.reduce(
        (total, video) => total + (video.views || 0),
        0
    );

    const videoIds = videos.map((video) => video._id);

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

 
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
                totalSubscribers
            },
            "Channel statistics fetched successfully"
        )
    );
});


// 2. Get All Videos Uploaded by the Creator
const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const videos = await video.find({
        owner: userId
    }).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    );
});
const getStudentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Fetch recently uploaded published videos
    const videos = await video.find({
        isPublished: true
    })
        .select("title thumbnail description duration views owner")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    // 2. Fetch the student's learning progress
    const progress = await Progress.find({
        user: userId
    })
        .populate("video", "title thumbnail duration isPublished")
        .sort({ lastWatchedAt: -1 })
        .lean();

    // 3. Videos the student can continue learning
    const continueLearning = progress.filter(
        (item) =>
            item.video &&
            item.video.isPublished &&
            !item.completed &&
            item.watchPercentage > 0
    );

    // 4. Calculate statistics
    const totalVideosStarted = progress.length;

    const completedVideos = progress.filter(
        (item) => item.completed
    ).length;

    const averageProgress = totalVideosStarted > 0
        ? Math.round(
            progress.reduce(
                (total, item) => total + item.watchPercentage,
                0
            ) / totalVideosStarted
        )
        : 0;

    // 5. Send the response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                videos,
                continueLearning,
                statistics: {
                    totalVideosStarted,
                    completedVideos,
                    averageProgress
                }
            },
            "Student dashboard fetched successfully"
        )
    );
});

export {
    getChannelStats,
    getChannelVideos,
    getStudentDashboard
};