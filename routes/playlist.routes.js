const { Router } = require("express");
const { verifyJWT } = require("../middleware/auth.middleware");
const {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist
} = require("../controllers/playlist.controller");

const playlistRouter = Router();

playlistRouter.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

playlistRouter.route("/create-playlist").post(createPlaylist);

// playlistRouter
//     .route("/:playlistId")
//     .get(getPlaylistById)
//     .patch(updatePlaylist)
//     .delete(deletePlaylist);

playlistRouter.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);
playlistRouter.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

playlistRouter.route("/user/:userId").get(getUserPlaylists);

module.exports = playlistRouter;
