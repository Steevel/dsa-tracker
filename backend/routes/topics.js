const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");
const { protect } = require("../middleware/auth");

// @route   GET /api/topics
// @desc    Get all topics with problems
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/topics/:id
// @desc    Get single topic
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
