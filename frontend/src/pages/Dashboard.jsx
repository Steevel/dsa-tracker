import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TopicCard from "../components/TopicCard";
import StatsBar from "../components/StatsBar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Build progress lookup map: "topicId_problemId" -> boolean
  const buildProgressMap = (progressList) => {
    const map = {};
    progressList.forEach((p) => {
      if (p.completed) {
        map[`${p.topic}_${p.problemId}`] = true;
      }
    });
    return map;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [topicsRes, progressRes, statsRes] = await Promise.all([
        api.get("/topics"),
        api.get("/progress"),
        api.get("/progress/stats"),
      ]);
      setTopics(topicsRes.data);
      setProgressMap(buildProgressMap(progressRes.data));
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to load data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggle = async (topicId, problemId) => {
    // Optimistic update
    const key = `${topicId}_${problemId}`;
    const wasCompleted = progressMap[key];

    setProgressMap((prev) => {
      const updated = { ...prev };
      if (wasCompleted) {
        delete updated[key];
      } else {
        updated[key] = true;
      }
      return updated;
    });

    // Update stats optimistically
    setStats((prev) => {
      if (!prev) return prev;
      const delta = wasCompleted ? -1 : 1;
      const newTotal = prev.totalCompleted + delta;
      return {
        ...prev,
        totalCompleted: newTotal,
        percentage: Math.round((newTotal / prev.totalProblems) * 100),
      };
    });

    try {
      await api.post("/progress/toggle", { topicId, problemId });
      // Refresh stats from server for accuracy
      const statsRes = await api.get("/progress/stats");
      setStats(statsRes.data);
    } catch (err) {
      // Revert on error
      setProgressMap((prev) => {
        const reverted = { ...prev };
        if (wasCompleted) {
          reverted[key] = true;
        } else {
          delete reverted[key];
        }
        return reverted;
      });
    }
  };

  // Filter + search
  const filteredTopics = topics.filter((topic) => {
    if (search) {
      const q = search.toLowerCase();
      const matchTopic = topic.name.toLowerCase().includes(q);
      const matchProblem = topic.problems.some((p) =>
        p.title.toLowerCase().includes(q)
      );
      if (!matchTopic && !matchProblem) return false;
    }
    if (filter === "Completed") {
      const done = topic.problems.filter(
        (p) => progressMap[`${topic._id}_${p._id}`]
      ).length;
      return topic.problems.length > 0 && done === topic.problems.length;
    }
    if (filter === "In Progress") {
      const done = topic.problems.filter(
        (p) => progressMap[`${topic._id}_${p._id}`]
      ).length;
      return done > 0 && done < topic.problems.length;
    }
    if (filter === "Pending") {
      const done = topic.problems.filter(
        (p) => progressMap[`${topic._id}_${p._id}`]
      ).length;
      return done === 0;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <Navbar stats={stats} />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Welcome header */}
          <div className={styles.welcomeHeader}>
            <div>
              <h1 className={styles.welcomeTitle}>
                <span className={styles.prompt}>~/</span>
                {user?.name?.split(" ")[0].toLowerCase()}
                <span className={styles.cursor}>_</span>
              </h1>
              <p className={styles.welcomeSub}>
                keep going. every solved problem compounds.
              </p>
            </div>
          </div>

          {/* Stats */}
          {!loading && <StatsBar stats={stats} />}

          {/* Search + filter bar */}
          <div className={styles.controls}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="search topics or problems..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              {["All", "Pending", "In Progress", "Completed"].map((f) => (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner} />
              <p>loading your sheet...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button onClick={fetchData} className={styles.retryBtn}>retry</button>
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className={styles.emptyState}>
              <p>no topics match your filters.</p>
            </div>
          ) : (
            <div className={styles.topicsList}>
              {filteredTopics.map((topic, idx) => (
                <div
                  key={topic._id}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  className={styles.topicWrapper}
                >
                  <TopicCard
                    topic={topic}
                    progressMap={progressMap}
                    onToggle={handleToggle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
