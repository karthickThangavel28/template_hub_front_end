import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, loading } = useAuth();

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:5000/auth/logout";
  };

  if (loading) return null; // ⏳ avoid flicker

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 0",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "800",
            background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Template Hub
        </h1>
      </Link>

      <div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* ✅ GitHub avatar */}
            <img
              src={`https://github.com/${user.username}.png`}
              alt="Avatar"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
              }}
            />

            <span style={{ fontWeight: "500" }}>
              {user.displayName || user.username}
            </span>

            <button
              onClick={handleLogout}
              className="btn"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "white",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className="btn btn-primary">
            Login with GitHub
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
