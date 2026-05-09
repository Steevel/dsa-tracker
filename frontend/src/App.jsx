import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--accent)",
        fontFamily: "var(--font-mono)",
        fontSize: "0.85rem"
      }}>
        initializing...
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />
          <Route
            path="/register"
            element={<PublicRoute><Register /></PublicRoute>}
          />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
