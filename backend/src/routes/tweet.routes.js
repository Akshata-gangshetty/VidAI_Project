import {Router} from "express"
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../controllers/tweet.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
const router = Router();
router.use(verifyJWt);
router.route("/tweets").post(createTweet);
router.route("/tweets/user/:userId").get(getUserTweets);
router.route("/tweets/:tweetId").put(updateTweet);
router.route("/tweets/:tweetId").delete(deleteTweet);
export default router;