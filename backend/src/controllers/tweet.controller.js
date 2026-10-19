import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content?.trim()){
        throw new ApiError(400,"Tweet content is required")

    }
    const tweet=await Tweet.create({
        content:content.trim(),
        owner:req.user._id
    })
    return res.status(201).json(new ApiResponse(201, "Tweet created successfully", tweet))
})

const getUserTweets = asyncHandler(async (req, res) => {
   
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid userId")
    }
    const tweets=await Tweet.find({owner:userId}).populate("owner","username fullname avatar").sort({createdAt:-1})
    return res.status(200).json(new ApiResponse(200, " User Tweets are fetched successfully", tweets))


})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
      const {tweetId}=req.params
      const {content}=req.body
      if(!content?.trim()){
        throw new ApiError(400,"Tweet content is required") 
      }
      const tweet=await Tweet.findByIdAndUpdate(tweetId,{content:content.trim()},{new:true})
      return res.status(200).json(new ApiResponse(200, "Tweet updated successfully", tweet))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const tweet=await Tweet.findByIdandDelete(tweetId);
     return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", tweet))


})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}