const express = require("express");
const {
  submitUserData,
  logInUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} = require("../controllers/controller");
const upload = require("../middleware/multer.middleware");
const { verifyJWT } = require("../middleware/auth.middleware");

const Routes = express.Router();

Routes.post(
  "/submitData",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  submitUserData
);

Routes.post("/login", logInUser);

//secured routes
Routes.post("/logout", verifyJWT, logOutUser);

Routes.post("/refresh-token", refreshAccessToken);

Routes.post("/change-password", verifyJWT, changeCurrentPassword);
Routes.get("/get-user", verifyJWT, getCurrentUser);
Routes.patch("/update-user", verifyJWT, updateAccountDetails);
// Routes.post("/update-avatar", verifyJWT,
//   upload.fields([
//     {
//       name: "avatar",
//       maxCount: 1,
//     },
//   ]),
//   updateUserAvatar
// );
Routes.patch(
  "/update-avatar",
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);
// Routes.post("/update-coverimage", verifyJWT,
//   upload.fields([
//     {
//       name: "coverImage",
//       maxCount: 1,
//     },
//   ]),
//   updateUserCoverImage
// );
Routes.patch(
  "/update-coverimage",
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);
// Routes.post("/user-channel", verifyJWT, getUserChannelProfile);
Routes.get("/channel/:userName", verifyJWT, getUserChannelProfile);
Routes.get("/watch-history", verifyJWT, getWatchHistory);

module.exports = Routes;
