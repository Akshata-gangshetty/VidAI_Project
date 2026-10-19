import { Router } from "express";
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
import { upload } from "../middlrwares/multer.middleware.js";
const router = Router();

router.use(verifyJWt);
router.route("/").get(getAllVideos);
console.log("verifyJWT",typeof verifyJWt);
console.log("upload.fields",typeof upload.fields);
console.log("updateVideo",typeof updateVideo);
router.route("/upload").post(upload.fields([
    { name: "videofile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
]), publishAVideo);
router.route("/:videoId").get(getVideoById);
router.route("/:videoId").patch(verifyJWt, updateVideo);
router.route("/:videoId").delete(verifyJWt, deleteVideo);
router.route("/:videoId/toggle-publish").patch(verifyJWt, togglePublishStatus);

export default router;