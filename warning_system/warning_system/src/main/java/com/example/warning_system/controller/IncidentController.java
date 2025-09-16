package com.example.warning_system.controller;

import com.example.warning_system.model.Alert;
import com.example.warning_system.model.Incident;
import com.example.warning_system.model.User;
import com.example.warning_system.repository.AlertRepository;
import com.example.warning_system.repository.IncidentRepository;
import com.example.warning_system.repository.UserRepository;
import com.example.warning_system.service.NotificationService;
import com.example.warning_system.service.TwilioService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:3000")
public class IncidentController {

    private static final Logger logger = LoggerFactory.getLogger(IncidentController.class);

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private NotificationService notificationService;

    // Report a new incident
    @PostMapping("/report")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> reportIncident(@RequestBody Incident incident) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            incident.setUserId(user.getUserId());
            incident.setTimestamp(LocalDateTime.now());
            incident.setStatus("PENDING");
            if (incident.getSeverity() == null) {
                incident.setSeverity(0.0);
            }
            // Accept latitude & longitude if provided, else null
            if (incident.getLatitude() == null || incident.getLongitude() == null) {
                incident.setLatitude(null);
                incident.setLongitude(null);
            }

            Incident saved = incidentRepository.save(incident);

//            try {
//                String normalizedPhone = normalizePhoneNumber(user.getPhone());
//
//                String emailBody = String.format(
//                        "Hello %s,\n\nThank you for reporting a new incident:\nType: %s\nLocation: %s\nSeverity: %.2f\n\nOur team will review and update you accordingly.",
//                        user.getName(),
//                        incident.getDisasterType(),
//                        incident.getLocation(),
//                        incident.getSeverity()
//                );
////                notificationService.sendEmail(user.getEmail(), "Incident Report Submitted", emailBody);
//
////                String whatsappMsg = String.format(
////                        "Hi %s, your incident report has been received.\nType: %s\nLocation: %s\nSeverity: %.2f",
////                        user.getName(),
////                        incident.getDisasterType(),
////                        incident.getLocation(),
////                        incident.getSeverity()
////                );
////                twilioService.sendWhatsAppMessage(normalizedPhone, whatsappMsg);
//
//            } catch (Exception ex) {
//                logger.error("Notification failure for reportIncident: {}", ex.getMessage());
//            }

            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            logger.error("Failed to report incident: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to report incident: " + e.getMessage());
        }
    }

    // Get pending incidents (admin only)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Incident>> getPendingIncidents() {
        List<Incident> pending = incidentRepository.findByStatus("PENDING");
        return ResponseEntity.ok(pending);
    }

    // Approve incident (admin only)
    @Transactional
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveIncident(@PathVariable Long id) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    if ("APPROVED".equalsIgnoreCase(incident.getStatus())) {
                        return ResponseEntity.badRequest().body("Incident already approved.");
                    }

                    // Approve incident
                    incident.setStatus("APPROVED");
                    incidentRepository.save(incident);

                    // Find existing alerts for same disaster type and location
                    List<Alert> alerts = alertRepository
                            .findByDisasterTypeAndLocation(incident.getDisasterType(), incident.getLocation());

                    Alert alert;
                    if (!alerts.isEmpty()) {
                        alert = alerts.get(0); // update the first alert
                        if (alerts.size() > 1) {
                            // Optional: log duplicate alerts for review
                            logger.warn("Multiple alerts found for {} at {}. Only the first is updated.",
                                    incident.getDisasterType(), incident.getLocation());
                        }
                    } else {
                        alert = new Alert();
                    }

                    // Set/update alert fields
                    alert.setDisasterType(incident.getDisasterType());
                    alert.setDescription(incident.getDescription());
                    alert.setLocation(incident.getLocation());
                    alert.setSeverityScore(incident.getSeverity());
                    alert.setTimestamp(LocalDateTime.now());
                    alert.setStatus("ACTIVE");
                    alert.setLatitude(incident.getLatitude());
                    alert.setLongitude(incident.getLongitude());

                    Alert savedAlert = alertRepository.save(alert);

                    // Send notifications safely
                    try {
                        User reporter = userRepository.findById(incident.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                        String normalizedPhone = normalizePhoneNumber(reporter.getPhone());
                        String msg = String.format(
                                "Hi %s, your incident has been approved.\nType: %s\nLocation: %s\nSeverity: %.2f",
                                reporter.getName(),
                                incident.getDisasterType(),
                                incident.getLocation(),
                                incident.getSeverity()
                        );
                        notificationService.sendSMS(normalizedPhone, msg);
                        twilioService.sendWhatsAppMessage(normalizedPhone, msg);
                    } catch (Exception e) {
                        logger.error("Notification failure for approveIncident: {}", e.getMessage());
                    }

                    return ResponseEntity.ok(savedAlert);
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("Incident not found."));
    }


    // Reject incident (admin only)
    @Transactional
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectIncident(@PathVariable Long id) {
        return incidentRepository.findById(id)
                .map(incident -> {
                    if ("REJECTED".equalsIgnoreCase(incident.getStatus())) {
                        return ResponseEntity.badRequest().body("Incident already rejected.");
                    }
                    incident.setStatus("REJECTED");
                    Incident saved = incidentRepository.save(incident);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.badRequest().body("Incident not found."));
    }

    // Bulk approve incidents (admin only)
    @Transactional
    @PostMapping("/bulk-approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkApprove(@RequestBody List<Long> incidentIds) {
        List<Alert> alerts = incidentIds.stream()
                .map(incidentRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .filter(inc -> !"APPROVED".equalsIgnoreCase(inc.getStatus()))
                .map(inc -> {
                    inc.setStatus("APPROVED");
                    incidentRepository.save(inc);
                    Alert alert = createAlertFromIncident(inc);

                    // Notifications could be added here if desired

                    return alertRepository.save(alert);
                })
                .toList();

        return ResponseEntity.ok(alerts);
    }

    private Alert createAlertFromIncident(Incident incident) {
        Alert alert = new Alert();
        alert.setDisasterType(incident.getDisasterType());
        alert.setDescription(incident.getDescription());
        alert.setLocation(incident.getLocation());
        alert.setSeverityScore(incident.getSeverity());
        alert.setTimestamp(LocalDateTime.now());
        alert.setStatus("ACTIVE");
        alert.setLatitude(incident.getLatitude());
        alert.setLongitude(incident.getLongitude());
        return alert;
    }

    private String normalizePhoneNumber(String phone) {
        if (phone == null) return null;
        phone = phone.trim();
        if (phone.startsWith("+91")) {
            return phone;
        } else if (phone.startsWith("0")) {
            return "+91" + phone.substring(1);
        } else if (phone.matches("\\d{10}")) {
            return "+91" + phone;
        } else {
            return phone;
        }
    }
}
