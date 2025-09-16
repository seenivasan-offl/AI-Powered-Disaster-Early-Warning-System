// src/main/java/com/example/warning_system/dto/AlertResponseDTO.java
package com.example.warning_system.dto;
import com.example.warning_system.model.Alert;
import java.time.LocalDateTime;

public class AlertResponseDTO {
    private Long alertId;
    private String disasterType;
    private Double severityScore;
    private String location;
    private String description;
    private LocalDateTime timestamp;
    private String status;
    private Double confidence;
    private Double latitude;
    private Double longitude;

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public static AlertResponseDTO fromEntity(Alert a) {
        AlertResponseDTO dto = new AlertResponseDTO();
        dto.alertId = a.getAlertId();
        dto.disasterType = a.getDisasterType();
        dto.severityScore = a.getSeverityScore();
        dto.location = a.getLocation();
        dto.description = a.getDescription();
        dto.timestamp = a.getTimestamp();
        dto.status = a.getStatus();
        dto.confidence = a.getConfidence();
        dto.latitude=a.getLatitude();
        dto.longitude=a.getLongitude();
        return dto;
    }
    // Getters and Setters

    public Long getAlertId() {
        return alertId;
    }

    public void setAlertId(Long alertId) {
        this.alertId = alertId;
    }

    public String getDisasterType() {
        return disasterType;
    }

    public void setDisasterType(String disasterType) {
        this.disasterType = disasterType;
    }

    public Double getSeverityScore() {
        return severityScore;
    }

    public void setSeverityScore(Double severityScore) {
        this.severityScore = severityScore;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
}
