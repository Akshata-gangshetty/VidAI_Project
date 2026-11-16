import {Apierror} from "../utils/ApiError.js"
import {Apiresponse} from "../utils/ApiResponse.js"
import {asynchandler,asyncHandler} from "../utils/asyncHandler.js"
import { video } from "../models/video.model.js"
import { Progress } from "../models/progress.model.js";
import { quiz,AiContent } from "../models/aiConnect.model.js";

const updateVideoProgress=asynchandler(async(req,res)=>{
    const {videoId}=req.params
    const {watchPercentage,lastWatchedPosition}=req.body
    if(watchPercentage===undefined || watchPercentage<0 || watchPercentage>100){
        throw new Apierror(400,"watchPercentage must be between 0 and 100")

    }
    const Video=await video.findById(videoId)
    if(!Video){
        throw new Apierror(400,"video not found")
    }
    const completed=watchPercentage===100
    const progress =await Progress.findOneAndUpdate(
        {
            user:req.user._id,
            video:videoId
        },
        {
            watchPercentage,
            lastWatchedPosition: lastWatchedPosition,
            completed,
            lastwatchedAt:new Date()
        },
        { new: true ,
            upsert:true,
            runValidators:true
        },
        
    )
    return res
        .status(201)
        .json(new Apiresponse(201, progress,"progress updated successfully"))

})
const getVideoProgress = asynchandler(async (req, res) => {
    const { videoId } = req.params;

    const progress = await Progress.findOne({
        user: req.user._id,
        video: videoId
    });

    return res.status(200).json(
        new Apiresponse(
            200,
            progress,
            "Video progress fetched successfully"
        )
    );
});
const saveQuizScore = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { selectedAnswers } = req.body;

  if(!selectedAnswers || typeof selectedAnswers!== "object" || Array.isArray(selectedAnswers)){
     throw new Apierror(
      400,
      "Invalid quiz answer"
    );
  }
  const aiContent=await AiContent.findOne({
    video:videoId,
    status:"completed"
  })
  if (!aiContent || !aiContent.quiz?.length) {
  throw new Apierror(404, "Quiz not found for this video");
}
  const totalQuestions=aiContent.quiz.length;
  const answerIndexs=Object.keys(selectedAnswers);
  if(answerIndexs.length !== aiContent.quiz.length){
    throw new Apierror(400,"Please answer all quiz questions")
  }
  for (const index of answerIndexs) {
    const questionIndex=Number(index);
    if(!NUmber.isInteger(questionIndex) || questionIndex<0 || questionIndex>=aiContent.quiz.length || typeof selectedAnswers[index] !== "string" || aiConntent.quiz[questionIndex].options.includes(studentAnswer) 
  ){
   throw new Apierror(400,"Invalid answer")
  }
}
  let correctAnswer=0;
  aiContent.quiz.forEach((question,index)=>{
    const studentAnswer=selectedAnswers[index];
    if(typeof studentAnswer === "string" && studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()){
      correctAnswer++;
    }
  })
  const score=Math.round((correctAnswer/totalQuestions)*100);
  const Video = await video.findById(videoId);

  if (!Video) {
    throw new Apierror(
      404,
      "Educational video not found"
    );
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
    new Apiresponse (
      200,{
         progress,
         correctAnswer,
         totalQuestions,
         score
      },
     

      "Quiz score saved successfully"
    )
  );
  });
const getMyProgress = asyncHandler(async (req, res) => {

    const progress = await Progress.find({
        user: req.user._id
    })
        .populate({
            path: "video",
            select: "title thumbnail duration"
        })
        .sort({
            updatedAt: -1
        });

    return res.status(200).json(
        new Apiresponse (
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
    getMyProgress
};