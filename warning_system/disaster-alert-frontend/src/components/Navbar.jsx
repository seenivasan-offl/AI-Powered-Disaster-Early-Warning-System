import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getUserRole = () => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role || null;
    } catch {
      return null;
    }
  };

  const userRole = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: "1rem", padding: "1rem", backgroundColor: "#ea1010ff" }}>
      {!token ? (
        <>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "white", textDecoration: "none" }}>
            Signup
          </Link>
        </>
      ) : (
        <>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Dashboard
          </Link>
          <Link to="/add-alert" style={{ color: "white", textDecoration: "none" }}>
            Add Alert
          </Link>
          <Link to="/report-incident" style={{ color: "white", textDecoration: "none" }}>
            Report Incident
          </Link>
          <Link to="/weather" style={{ color: "white", textDecoration: "none" }}>
            Weather
          </Link>
            <Link to="/historical-predictions" style={{ color: "white", textDecoration: "none" }}>
            Historical Predictions
            </Link>
            <Link to="/ai-demo" style={{ color: "white", textDecoration: "none" }} >AI Predictions</Link>
          {userRole === "ADMIN" && (
            <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#8b0000",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
