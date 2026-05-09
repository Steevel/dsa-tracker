import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar({ stats }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>{"</>"}</span>
        <span className={styles.logoText}>DSA Sheet</span>
      </div>

      <div className={styles.center}>
        {stats && (
          <div className={styles.progressPill}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <span className={styles.progressLabel}>
              {stats.totalCompleted}/{stats.totalProblems} solved
            </span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        {user && (
          <>
            <span className={styles.userName}>
              <span className={styles.prompt}>@</span>{user.name.split(" ")[0].toLowerCase()}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
