import mongoose from "mongoose";

const EventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    checkInStatus: {
      type: String,
      enum: ["pending", "checked-in", "cancelled", "no-show"],
      default: "pending",
    },
    meta: {
      type: Map,
      of: String, // Flexible key-value pairs for extra questions
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registration for the same user and event
EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });
EventRegistrationSchema.index({ event: 1 }); // For listing registrations by event

export default mongoose.model("EventRegistration", EventRegistrationSchema);
