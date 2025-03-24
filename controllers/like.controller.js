const { default: mongoose } = require("mongoose");
const Like = require("../models/like.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const Video = require("../models/video.models");
const User = require("../models/user.models");

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  // const like = await Like.aggregate([
  // ])
  const isLiked = await Like.findOne({ video: videoId, likedBy: req.user._id });
  console.log(isLiked, videoId);

  if (isLiked) {
    await Like.deleteOne(isLiked._id);
    await Video.updateOne(
      { _id: videoId },
      { $pull: { likedBy: req.user._id } }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, isLiked, "Video unliked successfully"));
  }

  const like = await Like.create({
    video: videoId,
    likedBy: req.user._id,
  });
  const likedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $addToSet: { likedBy: req.user._id },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { like: like, likedVideo: likedVideo },
        "Video liked successfully"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  // console.log(req.user._id);

  const likedVideos = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedBy",
        as: "likedVideos",
        pipeline: [
          {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "video",
              pipeline: [
                {
                  $addFields: {
                    totalLikes: {
                      $size: "$likedBy",
                    },
                  },
                },
                {
                  $project: {
                    title: 1,
                    duration: 1,
                    totalLikes: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              video: {
                $first: "$video",
              },
            },
          },
          {
            $project: {
              video: 1,
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos[0].likedVideos,
        "Liked Videos fetched successfully"
      )
    );
});

module.exports = { toggleVideoLike, getLikedVideos };
