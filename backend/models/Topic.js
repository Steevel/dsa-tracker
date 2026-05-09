const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  youtubeLink: { type: String, default: "" },
  leetcodeLink: { type: String, default: "" },
  articleLink: { type: String, default: "" },
  order: { type: Number, default: 0 },
});

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "📚" },
    order: { type: Number, default: 0 },
    problems: [problemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Topic", topicSchema);
