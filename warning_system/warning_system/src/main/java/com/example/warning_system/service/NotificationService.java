package com.example.warning_system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    public NotificationService() {
        // No mailSender needed anymore
    }

    // Send WhatsApp / SMS notification asynchronously
    @Async
    public void sendWhatsApp(String phone, String message) {
        try {
            // Here you can call TwilioService or any WhatsApp API integration
            // For now, just logging
            logger.info("WhatsApp sent to {}: {}", phone, message);
        } catch (Exception e) {
            logger.error("Failed to send WhatsApp to {}: {}", phone, e.getMessage());
        }
    }

    @Async
    public void sendSMS(String phone, String message) {
        try {
            // For SMS (Twilio or mock)
            logger.info("SMS sent to {}: {}", phone, message);
        } catch (Exception e) {
            logger.error("Failed to send SMS to {}: {}", phone, e.getMessage());
        }
    }
}
