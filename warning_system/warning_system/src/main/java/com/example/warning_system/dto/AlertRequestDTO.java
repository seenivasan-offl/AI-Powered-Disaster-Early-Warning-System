// src/main/java/com/example/warning_system/dto/AlertRequestDTO.java
package com.example.warning_system.dto;

import jakarta.validation.constraints.*;

public class AlertRequestDTO {
    @NotBlank
    private String disasterType;
    @NotNull
    @DecimalMin("0")
    @DecimalMax("10")
    private Double severityScore;
    @NotBlank
    private String location;
    private String description;
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
// latitude and longitude as needed
    // getters/setters
}
