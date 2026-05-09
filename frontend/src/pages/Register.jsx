import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
          <p className={styles.tagline}>// start your journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>
            <span className={styles.prompt}>~$</span> register
          </h2>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label}>full name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Arjun Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>email</label>
            <input
              className={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <><span className={styles.prompt}>{">"}</span> create account</>
            )}
          </button>

          <p className={styles.switchText}>
            have an account?{" "}
            <Link to="/login" className={styles.switchLink}>
              login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
