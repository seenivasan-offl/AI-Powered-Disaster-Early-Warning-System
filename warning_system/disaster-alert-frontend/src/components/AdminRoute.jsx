import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role === "ADMIN") {
      return children;
    }
    return <Navigate to="/" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
