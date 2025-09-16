// frontend/src/components/AlertsMap.jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import AlertMarker from './AlertMarker';
import { fetchAlerts } from '../api';
import { connectAlerts } from '../ws/wsClient';

export default function AlertsMap() {
  const [alerts, setAlerts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch existing alerts from backend
    const fetchInitialAlerts = async () => {
      try {
        const data = await fetchAlerts(token);
        setAlerts(data);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };
    fetchInitialAlerts();

    // Connect to WebSocket for real-time alerts
    const client = connectAlerts(
      (alert) => {
        setAlerts((prev) => [alert, ...prev]); // newest first
      },
      token // optional: pass JWT if your WS backend requires authentication
    );

    // Cleanup on unmount
    return () => {
      client.deactivate();
    };
  }, [token]);

  // Determine initial map center: first alert or default Chennai
  const center = alerts.length
    ? [alerts[0].location?.lat ?? alerts[0].lat, alerts[0].location?.lng ?? alerts[0].lng]
    : [13.0827, 80.2707];

  return (
    <MapContainer center={center} zoom={8} style={{ height: '80vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {alerts.map((a) => (
        <AlertMarker key={a.alertId ?? a.incidentId} alert={a} />
      ))}
    </MapContainer>
  );
}
