import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      default: "TBD",
    },
    capacity: {
      type: Number,
      min: 0,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    banner: {
      type: String,
      default: "",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ date: 1 });
EventSchema.index({ tags: 1 });

export default mongoose.model("Event", EventSchema);
