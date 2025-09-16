package com.example.warning_system.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class WeatherIngestionService {
    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    // inject repository or message queue (RabbitTemplate) to push data to AI pipeline

    @Value("${openweather.apikey}")
    private String apiKey;

    @Scheduled(fixedRateString = "${weather.poll.interval:60000}")
    public void pollWeather() {
        try {
            String city = "Chennai";
            String url = String.format("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric", city, apiKey);
            String resp = rest.getForObject(url, String.class);
            JsonNode root = mapper.readTree(resp);
            double rain1h = root.path("rain").path("1h").asDouble(0.0);
            // Create payload for AI microservice
            Map<String,Object> payload = Map.of("location", city, "sequence", List.of(rain1h)); // extend to real timeseries
            // POST to AI service:
            rest.postForEntity("http://localhost:5001/predict", payload, String.class);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
