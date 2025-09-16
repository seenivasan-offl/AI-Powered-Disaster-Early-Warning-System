package com.example.warning_system.controller;

import com.example.warning_system.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:3000")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/predict/flood")
    public ResponseEntity<?> flood(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictFlood(body));
    }

    @PostMapping("/predict/fire")
    public ResponseEntity<?> fire(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictFire(body));
    }

    @PostMapping("/predict/social")
    public ResponseEntity<?> social(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictSocial(body));
    }

    @PostMapping("/predict/storm")
    public ResponseEntity<?> storm(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictStorm(body));
    }

    @PostMapping("/predict/earthquake")
    public ResponseEntity<?> earthquake(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictEarthquake(body));
    }

    @PostMapping("/predict/risk")
    public ResponseEntity<?> risk(@RequestBody Map<String,Object> body) {
        return ResponseEntity.ok(aiService.predictRisk(body));
    }
}
