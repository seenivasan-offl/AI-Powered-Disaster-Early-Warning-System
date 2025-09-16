// src/main/java/com/example/warning_system/model/WeatherData.java
package com.example.warning_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "weather_data")
public class WeatherData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String location;    // e.g., city name

    private Double temperature; // in Celsius

    private Double rainfall1h;  // rainfall in last 1 hour (mm)

    private Double windSpeed;   // wind speed in m/s

    private LocalDateTime timestamp;  // time of the observation

}
