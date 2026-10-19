import {Router} from "express"
import { toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels } from "../controllers/subscription.controller.js";
import { verifyJWt } from "../middlrwares/auth.middleware.js";
const router = Router();
router.use(verifyJWt);
router.route("/:channelId/toggle-subscription").patch(toggleSubscription);

router.route("/subscribers/:channelId").get(getUserChannelSubscribers);
router.route("/subscribed-channels").get(getSubscribedChannels);
export default router;
