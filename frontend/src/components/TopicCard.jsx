import { useState } from "react";
import ProblemRow from "./ProblemRow";
import styles from "./TopicCard.module.css";

export default function TopicCard({ topic, progressMap, onToggle, topicStats }) {
  const [expanded, setExpanded] = useState(false);

  const total = topic.problems.length;
  const done = topic.problems.filter(
    (p) => progressMap[`${topic._id}_${p._id}`]
  ).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className={`${styles.card} ${expanded ? styles.cardOpen : ""}`}>
      <button
        className={styles.header}
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        <div className={styles.headerLeft}>
          <span className={styles.icon}>{topic.icon}</span>
          <div>
            <h3 className={styles.topicName}>{topic.name}</h3>
            <p className={styles.topicDesc}>{topic.description}</p>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressGroup}>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className={styles.progressText}>
              {done}/{total}
            </span>
          </div>
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <div className={styles.problemsWrapper}>
          <div className={styles.tableHeader}>
            <span className={styles.thStatus}>done</span>
            <span className={styles.thTitle}>problem</span>
            <span className={styles.thLevel}>level</span>
            <span className={styles.thLinks}>resources</span>
          </div>

          {topic.problems.map((problem, idx) => (
            <ProblemRow
              key={problem._id}
              problem={problem}
              topicId={topic._id}
              completed={!!progressMap[`${topic._id}_${problem._id}`]}
              onToggle={onToggle}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
