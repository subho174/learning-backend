const { default: mongoose } = require("mongoose");
const Playlist = require("../models/playlist.model");
const User = require("../models/user.models");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const Video = require("../models/video.models");

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!(name || description))
    return res.status(400).json(new ApiError(400, "All fields are required"));

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
  });

  if (!playlist)
    return res.status(400).json(new ApiError(400, "failed to create playlist"));

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created succesfully"));
  //TODO: create playlist
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  const playlists = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "playlists",
        localField: "_id",
        foreignField: "owner",
        as: "playlist",
        pipeline: [
          {
            $project: {
              name: 1,
              description: 1,
              videos: 1,
            },
          },
        ],
      },
    },
  ]);

  if (playlists.length === 0)
    return res.status(200).json(new ApiError(404, "User playlist not found"));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        playlists[0].playlist,
        "User playlist fetched successfully"
      )
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const isVideoExist = await Video.findById(videoId);
  if (!isVideoExist)
    return res
      .status(400)
      .json(new ApiResponse(404, undefined, "Video is not found"));

  const newVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videoId } }, // TODO - STOP same video to be added in playlist
    // issue ! same video is not being added more but still returning that updated , fix needed !!
    { new: true }
  );

  if (!newVideo)
    return res
      .status(400)
      .json(
        new ApiResponse(400, undefined, "Video could not be added to playlist")
      );

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video added to the playlist"));
  // const newVideoinPlaylist = await Playlist.aggregate([
  //   {
  //     $match: {
  //       _id: new mongoose.Types.ObjectId(playlistId),
  //     },
  //   },
  // //   {
  // //     $lookup: {
  // //       from: "videos",
  // //       localField: "videos",
  // //       foreignField: "_id",
  // //       as: "videos",
  // //     },
  // //   },
  // {
  //     $lookup: {
  //       from: "videos",
  //       localField: "owner",
  //       foreignField: "owner",
  //       as: "videos",
  //     },
  //   },
  // ]);

  return res
    .status(200)
    .json(new ApiResponse(200, newVideoinPlaylist, "fetched all videos"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  const isVideoExist = await Video.findById(videoId);
  if (!isVideoExist)
    return res
      .status(400)
      .json(new ApiResponse(404, undefined, "Video is not found"));

  const deleteVideo = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: { videos: videoId },
    },
    { new: true }
  );

  if (!deleteVideo)
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          undefined,
          "Video could not be deleted from playlist"
        )
      );

  return res
    .status(200)
    .json(new ApiResponse(200, deleteVideo, "Video deleted from playlist"));
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

module.exports = {
  createPlaylist,
  getUserPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
};
