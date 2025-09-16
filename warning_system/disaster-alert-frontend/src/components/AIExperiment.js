import React, { useState } from "react";
import axios from "axios";

export default function AIPredictionDemo() {
  const [seq, setSeq] = useState("10,20,3");
  const [socialText, setSocialText] = useState("Flood in Chennai city right now!");
  const [location, setLocation] = useState("Chennai");  // default or blank
  const [results, setResults] = useState({});

  const callAI = async (type, payload) => {
    try {
      // include location in every payload
      const body = { ...payload, location: location };
      const res = await axios.post(`http://localhost:8081/api/ai/predict/${type}`, body);
      setResults(prev => ({ ...prev, [type]: res.data }));
    } catch (e) {
      console.error(e);
      alert(`Failed to call ${type}: ` + (e.response?.data?.error || e.message));
    }
  };

  const handleCall = (type) => {
    const arr = seq.split(",").map(s => parseFloat(s.trim()));
    callAI(type, { sequence: arr });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🌍 AI Disaster Prediction Demo</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Enter location / city name"
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Sensor Data Input</h3>
        <p>Enter numeric sequence (rainfall, water level, severity). Example: 10,20,3</p>
        <input
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          style={{ width: "60%" }}
        />
        <div style={{ marginTop: 10 }}>
          <button onClick={() => handleCall("flood")}>🌊 Flood</button>
          <button onClick={() => handleCall("fire")}>🔥 Fire</button>
          <button onClick={() => handleCall("earthquake")}>🌎 Earthquake</button>
          <button onClick={() => handleCall("storm")}>🌪 Storm</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Social Media Input</h3>
        <textarea
          rows="3"
          value={socialText}
          onChange={(e) => setSocialText(e.target.value)}
          style={{ width: "60%" }}
        />
        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => callAI("social", { text: socialText })}
          >
            📝 Analyze Social Media
          </button>
        </div>
      </div>

      <div style={{ marginTop: 30 }}>
        <h3>🔮 AI Results</h3>
        {Object.keys(results).length === 0 && <p>No results yet.</p>}
        {Object.entries(results).map(([key, value]) => (
          <div
            key={key}
            style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}
          >
            <h4>{key.toUpperCase()}</h4>
            <p><b>Disaster:</b> {value.disaster_type}</p>
            <p><b>Severity (0-100):</b> {value.severity}</p>
            <p><b>Confidence (0-1):</b> {value.confidence}</p>
            <p><b>Location:</b> {value.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
