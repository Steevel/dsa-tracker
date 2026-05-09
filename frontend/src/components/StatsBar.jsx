import styles from "./StatsBar.module.css";

export default function StatsBar({ stats }) {
  if (!stats) return null;

  const levels = [
    { key: "Easy", color: "var(--easy)", bg: "var(--easy-bg)" },
    { key: "Medium", color: "var(--medium)", bg: "var(--medium-bg)" },
    { key: "Hard", color: "var(--hard)", bg: "var(--hard-bg)" },
  ];

  return (
    <div className={styles.statsBar}>
      <div className={styles.totalCard}>
        <div className={styles.totalNum}>{stats.totalCompleted}</div>
        <div className={styles.totalLabel}>/ {stats.totalProblems} solved</div>
        <div className={styles.totalPct}>{stats.percentage}% complete</div>
      </div>

      <div className={styles.levelCards}>
        {levels.map(({ key, color, bg }) => {
          const data = stats.byLevel?.[key] || { total: 0, done: 0 };
          const pct = data.total > 0 ? Math.round((data.done / data.total) * 100) : 0;
          return (
            <div key={key} className={styles.levelCard} style={{ "--lc": color, "--lbg": bg }}>
              <div className={styles.levelTop}>
                <span className={styles.levelBadge} style={{ color, background: bg }}>
                  {key}
                </span>
                <span className={styles.levelCount}>
                  {data.done}/{data.total}
                </span>
              </div>
              <div className={styles.miniBar}>
                <div className={styles.miniBarFill} style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
