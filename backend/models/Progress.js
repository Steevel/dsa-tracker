const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup + uniqueness
progressSchema.index({ user: 1, topic: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
