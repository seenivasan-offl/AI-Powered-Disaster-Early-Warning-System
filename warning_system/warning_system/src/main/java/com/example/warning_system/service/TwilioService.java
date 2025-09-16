package com.example.warning_system.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class TwilioService {

    @Value("${twilio.sid}")
    private String accountSid;

    @Value("${twilio.token}")
    private String authToken;

    @Value("${twilio.from}")
    private String fromNumber; // Example: +14155238886

    @PostConstruct
    public void initTwilio() {
        Twilio.init(accountSid, authToken);
    }

    @Async
    public void sendWhatsAppMessage(String to, String body) {
        // to should be plain digits from DB like 9865658539
        String formattedTo = to.startsWith("+") ? "whatsapp:" + to : "whatsapp:+91" + to;
        String formattedFrom = "whatsapp:" + fromNumber;

        Message.creator(
                new PhoneNumber(formattedTo),
                new PhoneNumber(formattedFrom),
                body
        ).create();

        System.out.println("WhatsApp message sent to " + formattedTo);
    }
}
