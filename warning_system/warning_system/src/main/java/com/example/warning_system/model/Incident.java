package com.example.warning_system.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long incidentId;

    private String disasterType;
    private String description;

    private String location; // human-readable area (e.g., "Delhi")
    private Double severity; // new field: 0-10 scale

    private LocalDateTime timestamp;
    private String status; // PENDING, APPROVED, REJECTED

    private Long userId; // who reported
    private Double latitude;
    private Double longitude;

}
