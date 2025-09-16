package com.example.warning_system.service;
import com.example.warning_system.model.Alert;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class SensorDataIngestionService {

    @RabbitListener(queues = "sensor.queue")
    public void receiveSensorData(String message) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> msg = mapper.readValue(message, Map.class);

            // Post to AI microservice
            RestTemplate rest = new RestTemplate();
            Map prediction = rest.postForObject("http://localhost:5001/predict", msg, Map.class);

            // Save prediction as alert (pseudo, use repository as needed)
            // Build Alert object
            Alert alert = new Alert();
            alert.setDisasterType(prediction.get("disaster_type").toString());
            alert.setSeverityScore(Double.parseDouble(prediction.get("severity").toString()));
            alert.setConfidence(Double.parseDouble(prediction.get("confidence").toString()));
            alert.setLocation(prediction.get("location").toString());
            alert.setLatitude(msg.get("latitude") != null ? Double.parseDouble(msg.get("latitude").toString()) : null);
            alert.setLongitude(msg.get("longitude") != null ? Double.parseDouble(msg.get("longitude").toString()) : null);
            alert.setDescription("Sensor AI prediction");
            alert.setTimestamp(LocalDateTime.now());
            alert.setStatus("ACTIVE");
            // Save with alertRepository.save(alert);

            System.out.println("AI-based alert auto-generated and saved.");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

}
