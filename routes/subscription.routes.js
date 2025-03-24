const Router = require("express");
const {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} = require("../controllers/subscription.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const subscribeRouter = Router();
subscribeRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

subscribeRouter
  .route("/channel/:channel_Id")
  .get(getSubscribedChannels)
  .post(toggleSubscription);

subscribeRouter.route("/:channelId").get(getUserChannelSubscribers);

module.exports = subscribeRouter;
