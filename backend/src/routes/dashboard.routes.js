import { Router } from "express";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
import{
    getChannelStats,getChannelVideos, getStudentDashboard
} from  "../controllers/dashboard.controller.js";
const router = Router();
router.use(verifyJWt);
router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);
router.route("/student-dashboard").get(getStudentDashboard);
export default router;
