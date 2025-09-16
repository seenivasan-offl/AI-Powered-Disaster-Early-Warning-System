import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationPicker({ position, setPosition, setAreaName }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const address = res.data.address;
        const name =
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          "Unknown Area";
        setAreaName(name);
      } catch {
        setAreaName("Unknown Area");
      }
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function AddAlertForm() {
  const [disasterType, setDisasterType] = useState("Flood");
  const [severityScore, setSeverityScore] = useState(5);
  const [position, setPosition] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position || !areaName) {
      setSnackbar({ open: true, message: "Please select a location on the map.", severity: "warning" });
      return;
    }
    if (severityScore < 0 || severityScore > 10) {
      setSnackbar({ open: true, message: "Severity must be between 0 and 10.", severity: "warning" });
      return;
    }
    try {
      const payload = {
        disasterType,
        severityScore: parseFloat(severityScore),
        location: areaName,
        latitude: position[0],
        longitude: position[1],
        description,
      };
      await axios.post("http://localhost:8081/api/alerts/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({ open: true, message: "Alert added successfully!", severity: "success" });

      // Reset form
      setDisasterType("Flood");
      setSeverityScore(5);
      setPosition(null);
      setAreaName("");
      setDescription("");
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.error || "Failed to add alert.", severity: "error" });
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4} px={2}>
      <Typography variant="h4" mb={3} align="center">
        Add New Alert
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <Select
          fullWidth
          value={disasterType}
          onChange={(e) => setDisasterType(e.target.value)}
          sx={{ mb: 2 }}
          required
        >
          {["Flood", "Earthquake", "Fire", "Storm", "Other"].map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>

        <TextField
          fullWidth
          type="number"
          label="Severity (0-10)"
          value={severityScore}
          onChange={(e) => setSeverityScore(e.target.value)}
          inputProps={{ min: 0, max: 10 }}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Description"
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box height={400} mb={2}>
          <MapContainer center={[10, 78]} zoom={6} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker position={position} setPosition={setPosition} setAreaName={setAreaName} />
          </MapContainer>
        </Box>

        <Typography variant="body2" mb={2}>
          Click on the map to select location. Selected area: {areaName || "none"}
        </Typography>

        <Button variant="contained" size="large" type="submit" fullWidth>
          Add Alert
        </Button>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
