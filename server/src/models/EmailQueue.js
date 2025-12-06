import mongoose from "mongoose";

const emailQueueSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    vars: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastError: {
      type: String,
    },
    nextAttemptAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding pending jobs due for processing
emailQueueSchema.index({ status: 1, nextAttemptAt: 1 });

const EmailQueue = mongoose.model("EmailQueue", emailQueueSchema);
export default EmailQueue;
