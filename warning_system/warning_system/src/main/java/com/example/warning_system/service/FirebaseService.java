package com.example.warning_system.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

@Service
public class FirebaseService {

    @PostConstruct
    public void init() {
        try {
            // Skip Firebase initialization during tests
            String testProperty = System.getProperty("spring.test.context.active");
            if (testProperty != null && testProperty.equals("true")) {
                System.out.println("Skipping Firebase init during tests");
                return;
            }

            FileInputStream serviceAccount = new FileInputStream("firebase-service-account.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (FileNotFoundException e) {
            System.out.println("Firebase service account not found, skipping Firebase init.");
        } catch (Exception e) {
            throw new RuntimeException("Firebase init failed", e);
        }
    }

    public void sendPush(String token, String title, String body) throws Exception {
        // Skip sending push notifications during tests
        String testProperty = System.getProperty("spring.test.context.active");
        if (testProperty != null && testProperty.equals("true")) {
            System.out.println("Skipping push message sending during tests");
            return;
        }

        Message message = Message.builder()
                .putData("title", title)
                .putData("body", body)
                .setToken(token)
                .build();
        FirebaseMessaging.getInstance().send(message);
    }
}
