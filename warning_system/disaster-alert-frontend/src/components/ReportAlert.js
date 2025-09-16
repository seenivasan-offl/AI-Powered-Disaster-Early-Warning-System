// src/components/ReportAlert.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { addAlert } from "../api";

// Map picker to select location and fetch area name
function LocationPicker({ position, setPosition, setAreaName }) {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        const name =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.county ||
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

export default function ReportAlert() {
  const [disasterType, setDisasterType] = useState("Flood");
  const [severityScore, setSeverityScore] = useState(5);
  const [position, setPosition] = useState(null);
  const [areaName, setAreaName] = useState("");
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position || !areaName) {
      return alert("Please select a location on the map.");
    }

    const payload = {
      disasterType,
      severityScore: parseFloat(severityScore),
      location: areaName,
      latitude: position[0],
      longitude: position[1],
      description,
    };

    try {
      await addAlert(payload, token);
      alert("Alert reported successfully!");
      // Reset form
      setDisasterType("Flood");
      setSeverityScore(5);
      setPosition(null);
      setAreaName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("Failed to report alert: " + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <h2>Report New Alert</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Disaster Type:
          <select value={disasterType} onChange={(e) => setDisasterType(e.target.value)}>
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
            value={severityScore}
            onChange={(e) => setSeverityScore(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
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
        <p>Click on the map to select location. Selected area: {areaName || "none"}</p>
        <button type="submit">Submit Alert</button>
      </form>
    </div>
  );
}
