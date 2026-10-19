import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
const router = Router();
router.use(verifyJWt);
router.route("/healthcheck").get(healthcheck);
export default router;