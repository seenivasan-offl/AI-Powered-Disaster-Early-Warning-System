// src/components/IncidentReportForm.js
import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to pick location by clicking on the map
function LocationPicker({ position, setPosition, setAreaName }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);

      try {
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const address = res.data.address || {};
        const name =
          address.city ||
          address.town ||
          address.village ||
          address.county ||
          "Unknown Area";
        setAreaName(name);
      } catch (err) {
        console.error("Geocoding error:", err);
        setAreaName("Unknown Area");
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function IncidentReportForm() {
  const [disasterType, setDisasterType] = useState("Flood");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [severity, setSeverity] = useState(5);
  const [aiSeverity, setAiSeverity] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position || !areaName) {
      alert("Please select a location on the map.");
      return;
    }

    if (severity < 0 || severity > 10) {
      alert("Severity must be between 0 and 10.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Call AI prediction service first
      const aiPayload = {
        location: areaName,
        rainfall: Math.floor(Math.random() * 100), // TODO: replace with real sensor values
        water_level: Math.floor(Math.random() * 10),
      };

      const aiResponse = await axios.post(
        "http://localhost:8081/api/alerts/predict-ai",
        aiPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiScore = aiResponse.data.severityScore || 0;
      setAiSeverity(aiScore);

      // 2️⃣ Report the incident (include AI score)
      const incidentPayload = {
        disasterType,
        description,
        location: areaName,
        latitude: position[0],
        longitude: position[1],
        severity: parseFloat(severity),
        aiSeverity: aiScore, // 🔥 Save AI prediction in DB too
      };

      await axios.post(
        "http://localhost:8081/api/incidents/report",
        incidentPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Incident reported successfully with AI prediction!");

      // Reset
      setDescription("");
      setPosition(null);
      setAreaName("");
      setDisasterType("Flood");
      setSeverity(5);
      setAiSeverity(null);
    } catch (err) {
      console.error(err);
      alert(
        "Error reporting incident: " +
          (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Report an Incident</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Disaster Type:
          <select
            value={disasterType}
            onChange={(e) => setDisasterType(e.target.value)}
          >
            <option>Flood</option>
            <option>Earthquake</option>
            <option>Fire</option>
            <option>Storm</option>
            <option>Other</option>
          </select>
        </label>
        <br />
        <label>
          Severity (0-10):
          <input
            type="number"
            min="0"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <br />
        <div style={{ height: 400, margin: "10px 0" }}>
          <MapContainer center={[10.0, 78.0]} zoom={6} style={{ height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              position={position}
              setPosition={setPosition}
              setAreaName={setAreaName}
            />
          </MapContainer>
        </div>
        <p>
          Click on the map to select location. Selected area:{" "}
          {areaName || "none"}
        </p>
        {aiSeverity !== null && (
          <p>
            <b>AI Predicted Severity:</b> {aiSeverity}
          </p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Incident"}
        </button>
      </form>
    </div>
  );
}
