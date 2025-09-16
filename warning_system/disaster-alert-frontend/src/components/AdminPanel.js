// src/components/AdminPanel.js
import React, { useEffect, useState } from "react";
import {
  getPendingIncidents,
  approveIncident,
  rejectIncident,
} from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

export default function AdminPanel() {
  const [incidents, setIncidents] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const data = await getPendingIncidents(token);
        setIncidents(data);
      } catch (err) {
        console.error("Error fetching pending incidents:", err);
        alert("Failed to fetch pending incidents.");
      }
    };
    fetchPending();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      await approveIncident(id, token);
      setNotification({ open: true, message: "Incident approved!", severity: "success" });
      const data = await getPendingIncidents(token);
      setIncidents(data);
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: "Failed to approve incident", severity: "error" });
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectIncident(id, token);
      setNotification({ open: true, message: "Incident rejected!", severity: "warning" });
      const data = await getPendingIncidents(token);
      setIncidents(data);
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: "Failed to reject incident", severity: "error" });
    }
  };

  const getSeverityColor = (score) => {
    if (score >= 7) return "red";
    if (score >= 4) return "orange";
    return "green";
  };

  return (
    <div style={{ maxWidth: 1000, margin: "20px auto" }}>
      <Typography variant="h4" gutterBottom>Admin Panel - Pending Incidents</Typography>

      {incidents.length === 0 ? (
        <Typography>No pending incidents.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc.incidentId}>
                  <TableCell>{inc.incidentId}</TableCell>
                  <TableCell>{inc.userId}</TableCell>
                  <TableCell>{inc.disasterType}</TableCell>
                  <TableCell>{inc.description}</TableCell>
                  <TableCell>{inc.location}</TableCell>
                  <TableCell style={{ color: getSeverityColor(inc.severity), fontWeight: "bold" }}>
                    {inc.severity}
                  </TableCell>
                  <TableCell>{new Date(inc.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button color="success" onClick={() => handleApprove(inc.incidentId)}>Approve</Button>
                    <Button color="error" onClick={() => handleReject(inc.incidentId)}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={notification.severity} variant="filled">{notification.message}</Alert>
      </Snackbar>
    </div>
  );
}
