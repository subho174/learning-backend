const { Router } = require("express");
const { verifyJWT } = require("../middleware/auth.middleware");
const { toggleVideoLike, getLikedVideos } = require("../controllers/like.controller");

const likeRouter = Router();
likeRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

likeRouter.route("/toggle/v/:videoId").post(toggleVideoLike);
// likeRouter.route("/toggle/c/:commentId").post(toggleCommentLike);
// likeRouter.route("/toggle/t/:tweetId").post(toggleTweetLike);
likeRouter.route("/videos").get(getLikedVideos);

module.exports = likeRouter;