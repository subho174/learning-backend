const Router = require("express");
const {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo
} = require("../controllers/video.controller");
const { verifyJWT } = require("../middleware/auth.middleware");
const upload = require("../middleware/multer.middleware");

const videoRouter = Router();
videoRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

videoRouter
  .route("/")
  .get(getAllVideos)
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    verifyJWT,
    publishAVideo
  );

videoRouter
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), verifyJWT, updateVideo);

// router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

module.exports = videoRouter;
