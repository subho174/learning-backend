// import mongoose, {isValidObjectId} from "mongoose"
// import {Video} from "../models/video.model.js"
// import {User} from "../models/user.model.js"
// import {ApiError} from "../utils/ApiError.js"
// import {ApiResponse} from "../utils/ApiResponse.js"
// import {asyncHandler} from "../utils/asyncHandler.js"
// import {uploadOnCloudinary} from "../utils/cloudinary.js"

const uploadOnCloudinary = require("../utils/cloudinary");
const User = require("../models/user.models");
const Video = require("../models/video.models");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const mongoose = require("mongoose");

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const allVideos = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "owner",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    avatar: 1,
                    coverImage: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
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
        allVideos[0].videos,
        "All Videos fetched successfully"
      )
    );
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title } = req.body;
  // TODO: get video, upload to cloudinary, create video
  // if (!title) throw new ApiError(400, "title is required");
  if (!title)
    return res
      .status(400)
      .json(new ApiResponse(400, undefined, "title is required"));

  const localVideoFilePath = req.files?.videoFile[0]?.path;
  const localThumbnailFilePath = req.files?.thumbnail[0]?.path;

  if (!localVideoFilePath) throw new ApiError(404, "Video file not found");
  if (!localThumbnailFilePath) throw new ApiError(404, "Thumbnail not found");

  const videoFile = await uploadOnCloudinary(localVideoFilePath);
  if (!videoFile)
    throw new ApiError(404, "Video file not uploaded to cloudinary");

  const thumbnail = await uploadOnCloudinary(localThumbnailFilePath);
  if (!thumbnail)
    throw new ApiError(404, "Thumbnail not uploaded to cloudinary");

  const newVideo = await Video.create({
    title: title,
    duration: videoFile.duration, // in seconds
    owner: req.user._id,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
  });

  if (!newVideo) throw new ApiError(400, "video is not saved in database");

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetchded successfully"));
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { newTitle } = req.body;

  if (!newTitle) throw new ApiError(404, "title is required");
  const newThumbnailLocalPath = req.file?.path;
  if (!newThumbnailLocalPath) throw new ApiError(404, "Thumbnail not found");
  const newThumbnail = await uploadOnCloudinary(newThumbnailLocalPath);

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: { title: newTitle, thumbnail: newThumbnail.url },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video details updated"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  //TODO: delete video
  const { videoId } = req.params;
  // const video = await Video.findByIdAndUpdate(
  //   videoId,
  //   {
  //     $unset: { // this process deletes videoFile key from document
  //       videoFile: "",
  //     },
  //   },
  //   {
  //     new: true,
  //   }
  // );
  const video = await Video.findOneAndDelete(videoId);
    return res.status(200).json(new ApiResponse(200, undefined, "Video deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

// export {
//     getAllVideos,
//     publishAVideo,
//     getVideoById,
//     updateVideo,
//     deleteVideo,
//     togglePublishStatus
// }

module.exports = {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
};
