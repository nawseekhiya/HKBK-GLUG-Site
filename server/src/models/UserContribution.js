import mongoose from "mongoose";

const userContributionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    type: {
      type: String,
      enum: ["project", "talk", "workshop", "blog", "other"],
      required: true,
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\//.test(v);
        },
        message: "Link must be a valid URL starting with http:// or https://",
      },
    },
    description: {
      type: String,
      trim: true,
      maxLength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

const UserContribution = mongoose.model("UserContribution", userContributionSchema);
export default UserContribution;
