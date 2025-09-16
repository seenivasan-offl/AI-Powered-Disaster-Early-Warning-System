package com.example.warning_system.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class HistoricalPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;
    private String disasterType; // <-- add this field
    private Double severityScore; // <-- add this field
    private Double latitude;
    private Double longitude;
    private LocalDate predictionDate;

    @Column(columnDefinition = "TEXT")
    private String predictionJson;

    @Column(columnDefinition = "TEXT")
    private String inputDataJson;

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public Double getSeverityScore() { return severityScore; }
    public void setSeverityScore(Double severityScore) { this.severityScore = severityScore; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDate getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; }

    public String getPredictionJson() { return predictionJson; }
    public void setPredictionJson(String predictionJson) { this.predictionJson = predictionJson; }

    public String getInputDataJson() { return inputDataJson; }
    public void setInputDataJson(String inputDataJson) { this.inputDataJson = inputDataJson; }
}
