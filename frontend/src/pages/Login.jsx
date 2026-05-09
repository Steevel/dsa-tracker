import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.gridBg} />
      <div className={styles.authContainer}>
        <div className={styles.logoBlock}>
          <span className={styles.logoIcon}>{"</>"}</span>
          <h1 className={styles.logoText}>DSA Sheet</h1>
          <p className={styles.tagline}>// track your coding journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            <span className={styles.prompt}>~$</span> login
          </h2>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <> <span className={styles.prompt}>{">"}</span> sign in</>
            )}
          </button>

          <p className={styles.switchText}>
            no account?{" "}
            <Link to="/register" className={styles.switchLink}>
              register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
