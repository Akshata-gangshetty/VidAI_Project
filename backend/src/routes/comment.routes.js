import { Router } from "express";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
import {
    getVideoComments, 
        addComment, 
        updateComment,
         deleteComment
} from  "../controllers/comment.controller.js";
const router = Router();

router.use(verifyJWt);
router.route("/comments").get(getVideoComments);
router.route("/comments").post(addComment);
router.route("/comments/:commentId").patch(updateComment)
router.route("/comments/:commentId").delete(deleteComment)
export default router;