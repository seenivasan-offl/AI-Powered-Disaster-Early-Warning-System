package com.example.warning_system.controller;

import com.example.warning_system.model.User;
import com.example.warning_system.repository.UserRepository;
import com.example.warning_system.service.NotificationService;
import com.example.warning_system.service.TwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notify")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TwilioService twilioService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/email")
    public String sendEmail(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

//        notificationService.sendEmail(user.getEmail(), "Disaster Alert", "Hello " + user.getName() + ", stay safe!");
        return "Email sent to " + user.getEmail();
    }

    @GetMapping("/whatsapp")
    public String sendWhatsApp(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Fix: prepend +91 (or your country code)
        String phone = "whatsapp:+91" + user.getPhone();

        twilioService.sendWhatsAppMessage(phone, "Hello " + user.getName() + "! This is a test WhatsApp message.");
        return "WhatsApp message sent to " + user.getPhone();
    }
}
