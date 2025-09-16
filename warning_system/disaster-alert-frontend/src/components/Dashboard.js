// src/components/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { Snackbar, Alert as MuiAlert, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import MapView from "./MapView";
import axios from "axios";

const BASE_URL = "http://localhost:8081/api"; // Change if your backend URL is different

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: "" });
  const previousAlertIds = useRef(new Set());
  const token = localStorage.getItem("token");

  const getSeverityColor = (score) => {
    if (score >= 7) return "red";      // High
    if (score >= 4) return "orange";   // Medium
    return "green";                     // Low
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/alerts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;

      // Notify if a new alert is received
      data.forEach((alert) => {
        if (!previousAlertIds.current.has(alert.alertId)) {
          previousAlertIds.current.add(alert.alertId);
          setNotification({ open: true, message: `New Alert: ${alert.disasterType} at ${alert.location}` });
        }
      });

      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <Typography variant="h4" gutterBottom>Disaster Dashboard</Typography>

      {/* Map showing alerts */}
      <MapView alerts={alerts} getSeverityColor={getSeverityColor} />

      {/* Alerts Table */}
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disaster</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.alertId}>
                <TableCell>{alert.disasterType}</TableCell>
                <TableCell style={{ color: getSeverityColor(alert.severityScore), fontWeight: "bold" }}>
                  {alert.severityScore}
                </TableCell>
                <TableCell>{alert.location}</TableCell>
                <TableCell>{alert.status}</TableCell>
                <TableCell>{new Date(alert.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert severity="info" variant="filled">
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
