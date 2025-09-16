package com.example.warning_system.dto;


import com.example.warning_system.model.Alert;

public class AlertDTO {
    public Long id; public String disasterType; public double severity; public double confidence;
    public double lat; public double lng; public String timestamp;
    public AlertDTO(Alert a) { /* map fields */ }
}
