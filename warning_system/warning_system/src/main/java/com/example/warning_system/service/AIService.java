package com.example.warning_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.HashMap;

@Service
public class AIService {
    private final RestTemplate rest = new RestTemplate();
    private final String AI_BASE = "http://localhost:5001";

    private Map<String,Object> postToAI(String path, Map<String,Object> payload) {
        String url = AI_BASE + path;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String,Object>> req = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> resp = rest.postForEntity(url, req, Map.class);
        return (Map<String,Object>) resp.getBody();
    }

    public Map<String,Object> predictFlood(Map<String,Object> payload) {
        return postToAI("/predict/flood", payload);
    }

    public Map<String,Object> predictFire(Map<String,Object> payload) {
        return postToAI("/predict/fire", payload);
    }

    public Map<String,Object> predictSocial(Map<String,Object> payload) {
        return postToAI("/predict/social", payload);
    }

    public Map<String,Object> predictStorm(Map<String,Object> payload) {
        return postToAI("/predict/storm", payload);
    }

    public Map<String,Object> predictEarthquake(Map<String,Object> payload) {
        return postToAI("/predict/earthquake", payload);
    }

    public Map<String,Object> predictRisk(Map<String,Object> payload) {
        return postToAI("/predict/risk", payload);
    }
}
