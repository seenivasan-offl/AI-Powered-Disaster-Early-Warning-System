package com.example.warning_system.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "alerts")
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;
    private String disasterType;
    private Double severityScore;
    private String location;
    private String description;
    private LocalDateTime timestamp;
    private String status; // ACTIVE / RESOLVED
    private Double confidence; // add getter/setter
    private Double latitude;
    private Double longitude;



}
