import React, { useState, useEffect } from "react";
import axios from "axios";

export default function HistoricalDataView() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (year, month, day) => {
    if (!year) return "Unknown";
    const m = month ? month.toString().padStart(2, "0") : "01";
    const d = day ? day.toString().padStart(2, "0") : "01";
    return `${year}-${m}-${d}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:8081/api/alerts/historical-predictions");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch historical data", error);
        alert("Failed to fetch historical data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "95%", margin: "auto" }}>
      <h2>Historical Disaster Data</h2>

      {data.length === 0 ? (
        <p>No data available</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f2f2f2" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Disaster</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Country</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Region</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Deaths</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Affected</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Location</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Disaster Type"] || "N/A"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Country"] || "N/A"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Region"] || "N/A"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {formatDate(item["Start Year"], item["Start Month"], item["Start Day"])}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Total Deaths"] || "0"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Total Affected"] || "0"}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {item["Location"] || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
