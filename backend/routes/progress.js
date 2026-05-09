const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const Topic = require("../models/Topic");
const { protect } = require("../middleware/auth");

// @route   GET /api/progress
// @desc    Get all progress for logged-in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user._id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/progress/stats
// @desc    Get progress stats (total, by topic, by difficulty)
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const topics = await Topic.find();
    const completedProgress = await Progress.find({
      user: req.user._id,
      completed: true,
    });

    const completedSet = new Set(
      completedProgress.map((p) => `${p.topic}_${p.problemId}`)
    );

    let totalProblems = 0;
    let totalCompleted = completedProgress.length;
    const byTopic = {};
    const byLevel = { Easy: { total: 0, done: 0 }, Medium: { total: 0, done: 0 }, Hard: { total: 0, done: 0 } };

    topics.forEach((topic) => {
      const topicCompleted = completedProgress.filter(
        (p) => p.topic.toString() === topic._id.toString()
      ).length;

      byTopic[topic._id] = {
        name: topic.name,
        total: topic.problems.length,
        completed: topicCompleted,
      };

      totalProblems += topic.problems.length;

      topic.problems.forEach((problem) => {
        byLevel[problem.level].total += 1;
        const key = `${topic._id}_${problem._id}`;
        if (completedSet.has(key)) {
          byLevel[problem.level].done += 1;
        }
      });
    });

    res.json({
      totalProblems,
      totalCompleted,
      percentage: totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0,
      byTopic,
      byLevel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/progress/toggle
// @desc    Toggle problem completion
// @access  Private
router.post("/toggle", protect, async (req, res) => {
  try {
    const { topicId, problemId } = req.body;

    if (!topicId || !problemId) {
      return res.status(400).json({ message: "topicId and problemId required" });
    }

    let progress = await Progress.findOne({
      user: req.user._id,
      topic: topicId,
      problemId: problemId,
    });

    if (progress) {
      progress.completed = !progress.completed;
      progress.completedAt = progress.completed ? new Date() : null;
      await progress.save();
    } else {
      progress = await Progress.create({
        user: req.user._id,
        topic: topicId,
        problemId: problemId,
        completed: true,
        completedAt: new Date(),
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
