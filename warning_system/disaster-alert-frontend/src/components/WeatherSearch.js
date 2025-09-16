import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../api";

export default function WeatherSearch() {
  const [location, setLocation] = useState("Chennai"); // Default city
  const [weatherData, setWeatherData] = useState(null); // Single object for current weather
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  // Fetch weather data when location changes
  useEffect(() => {
    if (!location) return;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(location);
        if (data.error) {
          setError(data.error);
          setWeatherData(null);
        } else {
          setWeatherData(data);
        }
      } catch (err) {
        setError(err.message);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [location]);

  // Search form submit handler
  const onSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setLocation(input.trim());
    }
  };

  // Get current geolocation and reverse geocode city
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            "";
          if (city) {
            setLocation(city);
            setInput(city);
          } else {
            alert("Could not determine city from your location");
          }
        } catch {
          alert("Failed to get city from your location");
        }
      },
      () => alert("Permission to access location was denied")
    );
  };

  return (
    <div style={{ maxWidth: 700, margin: "1rem auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
        🌤️ Weather Dashboard
      </h2>

      {/* Search bar */}
      <form onSubmit={onSearch} style={{ marginBottom: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flexGrow: 1,
            padding: "10px",
            fontSize: 16,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#e53e3e",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          Search
        </button>
        <button
          type="button"
          onClick={useCurrentLocation}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#38a169",
            color: "white",
            border: "none",
            borderRadius: 6,
          }}
        >
          📍 Use My Location
        </button>
      </form>

      {/* Status messages */}
      {loading && (
        <p style={{ color: "#3182ce", fontWeight: "bold", textAlign: "center" }}>
          Loading weather data for {location}...
        </p>
      )}
      {error && (
        <p style={{ color: "#e53e3e", fontWeight: "bold", textAlign: "center" }}>
          ⚠️ {error}
        </p>
      )}

      {/* Weather data display */}
      {weatherData && !error && (
        <div>
          <h3 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" }}>
            Weather Data for {weatherData.city}
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: 16,
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f7fafc" }}>
                <th style={{ padding: 12, borderBottom: "2px solid #e2e8f0" }}>Timestamp</th>
                <th style={{ padding: 12, borderBottom: "2px solid #e2e8f0" }}>Temperature (°C)</th>
                <th style={{ padding: 12, borderBottom: "2px solid #e2e8f0" }}>Humidity (%)</th>
                <th style={{ padding: 12, borderBottom: "2px solid #e2e8f0" }}>Rainfall (mm)</th>
                <th style={{ padding: 12, borderBottom: "2px solid #e2e8f0" }}>Wind Speed (m/s)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ transition: "background-color 0.3s", cursor: "default" }}>
                <td style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
                  {new Date(weatherData.timestamp).toLocaleString()}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
                  {weatherData.temperature?.toFixed(1)}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
                  {weatherData.humidity ?? "N/A"}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
                  {weatherData.rainfall1h?.toFixed(1) ?? "0.0"}
                </td>
                <td style={{ padding: 12, borderBottom: "1px solid #e2e8f0" }}>
                  {weatherData.windSpeed?.toFixed(1) ?? "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
