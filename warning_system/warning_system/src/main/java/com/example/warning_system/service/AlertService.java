package com.example.warning_system.service;
import com.example.warning_system.dto.AlertDTO;
import com.example.warning_system.model.Alert;
import com.example.warning_system.repository.AlertRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AlertService {
    private final AlertRepository alertRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public AlertService(AlertRepository alertRepo, SimpMessagingTemplate messagingTemplate) {
        this.alertRepo = alertRepo;
        this.messagingTemplate = messagingTemplate;
    }

    public Alert createAlert(Alert alert) {
        Alert saved = alertRepo.save(alert);
        // send to websocket subscribers
        messagingTemplate.convertAndSend("/topic/alerts", new AlertDTO(saved));
        return saved;
    }
}

