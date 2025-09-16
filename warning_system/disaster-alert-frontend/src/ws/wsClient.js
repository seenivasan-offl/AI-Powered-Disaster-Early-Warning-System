// frontend/src/ws/wsClient.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Connect to the backend WebSocket and subscribe to alerts.
 * @param {function} onAlert - Callback function called when a new alert is received.
 * @returns {Client} STOMP client instance
 */
export function connectAlerts(onAlert) {
  const client = new Client({
    // Use SockJS for fallback
    webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    debug: () => {}, // disable debug logging
    reconnectDelay: 5000, // reconnect every 5 seconds if disconnected
  });

  client.onConnect = () => {
    // Subscribe to alerts topic
    client.subscribe('/topic/alerts', (msg) => {
      const payload = JSON.parse(msg.body);
      onAlert(payload);
    });
  };

  client.activate(); // start connection
  return client;
}
