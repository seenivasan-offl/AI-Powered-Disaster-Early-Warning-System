package com.example.warning_system.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:3000")
public class WeatherController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${openweather.apikey}")
    private String apiKey;

    @GetMapping(value = "/current/{city}", produces = MediaType.APPLICATION_JSON_VALUE)
    public String getCurrentWeather(@PathVariable("city") String city) {
        try {
            String url = String.format(
                    "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric",
                    city, apiKey);

            System.out.println("👉 Fetching weather from: " + url);

            String response = restTemplate.getForObject(url, String.class);
            System.out.println("👉 API Response: " + response);

            JsonNode root = mapper.readTree(response);

            JsonNode mainNode = root.path("main");
            JsonNode windNode = root.path("wind");
            JsonNode rainNode = root.path("rain");

            ObjectNode simplified = mapper.createObjectNode();
            simplified.put("city", city);
            simplified.put("temperature", mainNode.path("temp").asDouble());
            simplified.put("humidity", mainNode.path("humidity").asInt());
            simplified.put("windSpeed", windNode.path("speed").asDouble());
            simplified.put("rainfall1h", rainNode.path("1h").asDouble(0.0));
            simplified.put("timestamp", java.time.Instant.now().toString());

            return simplified.toString();

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 print the real error
            return "{\"error\": \"Failed to fetch weather data\"}";
        }
    }
}
