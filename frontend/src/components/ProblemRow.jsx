import { useState } from "react";
import styles from "./ProblemRow.module.css";

const LEVEL_CONFIG = {
  Easy: { cls: "easy", label: "Easy" },
  Medium: { cls: "medium", label: "Medium" },
  Hard: { cls: "hard", label: "Hard" },
};

export default function ProblemRow({ problem, topicId, completed, onToggle, index }) {
  const [toggling, setToggling] = useState(false);
  const lvl = LEVEL_CONFIG[problem.level] || LEVEL_CONFIG.Medium;

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      await onToggle(topicId, problem._id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div
      className={`${styles.row} ${completed ? styles.rowDone : ""}`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {/* Checkbox */}
      <div className={styles.checkCell}>
        <button
          className={`${styles.checkbox} ${completed ? styles.checkboxDone : ""} ${toggling ? styles.checkboxToggling : ""}`}
          onClick={handleToggle}
          aria-label={`Mark ${problem.title} as ${completed ? "incomplete" : "complete"}`}
        >
          {completed && <span className={styles.checkmark}>✓</span>}
        </button>
      </div>

      {/* Title */}
      <div className={styles.titleCell}>
        <span className={`${styles.problemNum} ${completed ? styles.problemNumDone : ""}`}>
          {String(index + 1).padStart(2, "0")}.
        </span>
        <span className={`${styles.problemTitle} ${completed ? styles.titleDone : ""}`}>
          {problem.title}
        </span>
      </div>

      {/* Level */}
      <div className={styles.levelCell}>
        <span className={`${styles.levelBadge} ${styles[lvl.cls]}`}>
          {lvl.label}
        </span>
      </div>

      {/* Links */}
      <div className={styles.linksCell}>
        {problem.youtubeLink && (
          <a
            href={problem.youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.linkBtn} ${styles.youtube}`}
            title="Watch on YouTube"
          >
            ▶ YT
          </a>
        )}
        {problem.leetcodeLink && (
          <a
            href={problem.leetcodeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.linkBtn} ${styles.leetcode}`}
            title="Solve on LeetCode"
          >
            LC
          </a>
        )}
        {problem.articleLink && (
          <a
            href={problem.articleLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.linkBtn} ${styles.article}`}
            title="Read Article"
          >
            📄
          </a>
        )}
      </div>
    </div>
  );
}
