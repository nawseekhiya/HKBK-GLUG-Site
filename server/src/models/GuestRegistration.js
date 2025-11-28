import mongoose from "mongoose";

const GuestRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    usn: {
      type: String,
      trim: true,
      uppercase: true, // Assuming USN is usually uppercase
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
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate registration for the same email and event
GuestRegistrationSchema.index({ event: 1, email: 1 }, { unique: true });
GuestRegistrationSchema.index({ event: 1 });

export default mongoose.model("GuestRegistration", GuestRegistrationSchema);
