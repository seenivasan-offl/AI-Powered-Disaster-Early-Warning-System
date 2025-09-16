// src/components/MapView.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ alerts, getSeverityColor }) => {
  // Create a colored marker icon for Leaflet
  const createMarkerIcon = (color) =>
    new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  return (
    <div style={{ height: "400px", marginBottom: "20px" }}>
      <MapContainer center={[20, 78]} zoom={5} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {alerts.map((alert) => {
          // Determine marker color based on severity
          let color = "green";
          if (getSeverityColor) {
            const sev = alert.severityScore ?? 0;
            if (sev >= 7) color = "red";
            else if (sev >= 4) color = "orange";
            else color = "green";
          }

          // Use provided lat/lng or fallback coordinates
          const position = alert.locationLatLng
            ? [alert.locationLatLng.lat, alert.locationLatLng.lng]
            : alert.lat && alert.lng
            ? [alert.lat, alert.lng]
            : [20, 78]; // default center

          return (
            <Marker key={alert.alertId} position={position} icon={createMarkerIcon(color)}>
              <Popup>
                <b>{alert.disasterType}</b>
                <br />
                Severity: {alert.severityScore}
                <br />
                Location: {alert.location}
                <br />
                Status: {alert.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
