const { mongoose, Schema } = require("mongoose");

const subscriptionSchema = new Schema(
  {
    subscriber: {
      // who is subscribing
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      // who is being subscribed
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
