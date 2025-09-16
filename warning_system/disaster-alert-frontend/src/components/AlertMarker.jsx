// src/components/AlertMarker.jsx
import React from "react";
import { CircleMarker, Popup } from "react-leaflet";

// Function to get color based on severity score (0-10)
const getColor = (severity) => {
  if (severity >= 7) return "#d73027"; // High severity - red
  if (severity >= 4) return "#f46d43"; // Medium severity - orange
  if (severity > 0) return "#fee08b";  // Low severity - yellow
  return "#4575b4";                     // Safe / unknown - blue
};

export default function AlertMarker({ alert }) {
  // Extract latitude and longitude from alert object
  const lat = alert.lat ?? alert.location?.lat ?? 0;
  const lng = alert.lng ?? alert.location?.lng ?? 0;

  // Severity score
  const severity = alert.severityScore ?? alert.severity ?? 0;

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={12}
      pathOptions={{ color: getColor(severity), fillOpacity: 0.7 }}
    >
      <Popup>
        <div style={{ minWidth: 200 }}>
          <strong>{alert.disasterType ?? alert.disaster_type}</strong><br />
          Severity: {Math.round(severity)} / 10<br />
          <small>{new Date(alert.timestamp).toLocaleString()}</small><br />
          <small>Location: {alert.locationName ?? alert.location ?? "N/A"}</small>
        </div>
      </Popup>
    </CircleMarker>
  );
}
