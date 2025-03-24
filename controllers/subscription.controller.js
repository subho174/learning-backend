const mongoose = require("mongoose");
const User = require("../models/user.models.js");
const Subscription = require("../models/subscription.models.js");
const { asyncHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channel_Id } = req.params;
  const channelId = await User.findById(channel_Id);

  if (!channelId)
    return res
      .status(404)
      .json(new ApiError(404, {}, "channel does not exist"));
  // throw new ApiError(404, "channel does not exist");

  if (req.user._id == channelId)
    throw new ApiError(400, "Both Id can not be same");

  const isOldSubscribe = await Subscription.find({
    $and: [{ subscriber: req.user._id, channel: channelId }],
  });

  if (isOldSubscribe.length > 0) {
    const unsubscribed = await Subscription.deleteOne({
      subscriber: req.user._id,
      channel: channelId,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, unsubscribed, "Unsubscribed successfully"));
  }

  const subscribe = await Subscription.create({
    subscriber: req.user._id,
    channel: channelId._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, subscribe, "Subscribed successfully"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const subscriberList = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "subscriber",
              foreignField: "_id",
              as: "subscriber",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              subscriber: {
                $first: "$subscriber",
              },
            },
          },
          {
            $project: {
              subscriber: 1,
              _id: 0,
            },
          },
        ],
      },
    },
  ]);

  if (subscriberList.length <= 0)
    return res
      .status(404)
      .json(new ApiResponse(404, undefined, "subscribers list not found"));

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriberList[0].subscribers, "subscribers List")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channel_Id } = req.params;

  const subscriptionList = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(channel_Id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscription",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "channel",
              foreignField: "_id",
              as: "channel",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              channel: {
                $first: "$channel",
              },
            },
          },
          {
            $project: {
              _id: 0,
              channel: 1,
            },
          },
        ],
      },
    },
  ]);

  if (subscriptionList.length <= 0)
    return res
      .status(404)
      .json(new ApiResponse(404, undefined, "subscription list not found"));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscriptionList[0].subscription,
        "subscription List"
      )
    );
});

module.exports = {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
