package com.example.warning_system.controller;

import com.example.warning_system.dto.AlertRequestDTO;
import com.example.warning_system.dto.AlertResponseDTO;
import com.example.warning_system.model.Alert;
import com.example.warning_system.model.HistoricalPrediction;
import com.example.warning_system.repository.AlertRepository;
import com.example.warning_system.repository.HistoricalPredictionRepository;
import com.example.warning_system.service.NotificationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.InputStream;
import java.io.Reader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import java.io.InputStreamReader;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:3000")
public class AlertController {

    private static final Logger logger = LoggerFactory.getLogger(AlertController.class);

    @Autowired
    private HistoricalPredictionRepository historicalPredictionRepository;

    @Autowired
    private AlertRepository alertRepository;
    @Autowired
    private ResourceLoader resourceLoader;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all alerts (DTO - hides internal fields)
     */
    @GetMapping("/")
    public ResponseEntity<List<AlertResponseDTO>> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        List<AlertResponseDTO> dtos = alerts.stream()
                .map(AlertResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    /**
     * Add a new alert (Validated DTO), triggers notification
     */
    @PostMapping("/add")
    public ResponseEntity<AlertResponseDTO> addAlert(@Valid @RequestBody AlertRequestDTO dto) {
        Alert alert = new Alert();
        alert.setDisasterType(dto.getDisasterType());
        alert.setSeverityScore(dto.getSeverityScore());
        alert.setLocation(dto.getLocation());
        alert.setDescription(dto.getDescription());
        alert.setLatitude(dto.getLatitude());      // NEW: store latitude
        alert.setLongitude(dto.getLongitude());    // NEW: store longitude
        alert.setTimestamp(LocalDateTime.now());
        alert.setStatus("ACTIVE");

        Alert savedAlert = alertRepository.save(alert);

        // Notify users (future: send to real user list/contacts)
        try {
            notificationService.sendSMS("+911234567890", "New Disaster Alert: " + alert.getDisasterType());
//            notificationService.sendEmail("user@example.com", "Disaster Alert",
//                    "New Alert: " + alert.getDisasterType());
            logger.info("Notification sent for alert ID {}", savedAlert.getAlertId());
        } catch (Exception e) {
            logger.error("Notification error for alert ID {}: {}", savedAlert.getAlertId(), e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(AlertResponseDTO.fromEntity(savedAlert));
    }
    @GetMapping("/historical-predictions")
    public ResponseEntity<?> getHistoricalPredictions() {
        try {
            Resource resource = resourceLoader.getResource("classpath:DISASTERS/public_emdat_project.csv");
            InputStream inputStream = resource.getInputStream();
            Reader reader = new InputStreamReader(inputStream);

            Iterable<CSVRecord> records = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .parse(reader);

            List<Map<String, String>> result = new ArrayList<>();

            for (CSVRecord record : records) {
                Map<String, String> row = new HashMap<>();
                for (String header : record.toMap().keySet()) {
                    row.put(header, record.get(header));
                }
                result.add(row);
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to load dataset: " + e.getMessage()));
        }
    }







    /**
     * Predict using external AI microservice, save prediction as alert
     */
    @PostMapping("/predict-ai")
    public ResponseEntity<?> predictAI(@RequestBody Map<String, Object> inputData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(inputData, headers);

            Map<String, Object> prediction = restTemplate.postForObject(
                    "http://localhost:5001/predict", request, Map.class
            );

            // Build Alert entity
            Alert alert = new Alert();
            alert.setSeverityScore(convertDouble(prediction.get("severity"), 0.0));
            alert.setConfidence(convertDouble(prediction.get("confidence"), null));
            alert.setDisasterType(toString(prediction.get("disaster_type"), "Unknown"));
            alert.setLocation(toString(prediction.get("location"), "Unknown"));
            alert.setDescription("Predicted by AI");
            alert.setLatitude(inputData.get("latitude") != null ? convertDouble(inputData.get("latitude"), null) : null);
            alert.setLongitude(inputData.get("longitude") != null ? convertDouble(inputData.get("longitude"), null) : null);
            alert.setTimestamp(LocalDateTime.now());
            alert.setStatus("ACTIVE");

            Alert savedAlert = alertRepository.save(alert);

            // Save historical prediction
            HistoricalPrediction hist = new HistoricalPrediction();
            hist.setLocation(alert.getLocation());

            // Use prediction date from inputData or current date if missing
            Object dateObj = inputData.get("date");
            if (dateObj != null) {
                hist.setPredictionDate(LocalDate.parse(dateObj.toString()));
            } else {
                hist.setPredictionDate(LocalDate.now());
            }

            // Convert maps to JSON strings using Jackson
            ObjectMapper objectMapper = new ObjectMapper();
            hist.setPredictionJson(objectMapper.writeValueAsString(prediction));
            hist.setInputDataJson(objectMapper.writeValueAsString(inputData));

            historicalPredictionRepository.save(hist);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AlertResponseDTO.fromEntity(savedAlert));

        } catch (Exception e) {
            logger.error("AI prediction error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Prediction failed: " + e.getMessage()));
        }
    }

    // Helper methods
    private Double convertDouble(Object value, Double defaultVal) {
        try {
            return value != null ? Double.valueOf(value.toString()) : defaultVal;
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private String toString(Object val, String defaultVal) {
        return val != null ? val.toString() : defaultVal;
    }

}
