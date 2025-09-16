package com.example.warning_system.service;

import com.example.warning_system.model.HistoricalPrediction;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvHistoricalPredictionService {

    private static final String CSV_FILE = "C:\\Users\\seeni\\OneDrive\\Documents\\warning_system\\warning_system\\ai_service\\DISASTERS\\processed_disasters.csv";

    public List<HistoricalPrediction> getHistoricalPredictions(String location, LocalDate date) {
        List<HistoricalPrediction> results = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(CSV_FILE))) {
            String header = br.readLine(); // skip header
            String line;

            while ((line = br.readLine()) != null) {
                try {
                    String[] parts = line.split(",", -1);
                    String loc = parts[0];
                    String disasterType = parts[1];
                    double severity = Double.parseDouble(parts[2]);
                    double latitude = Double.parseDouble(parts[3]);
                    double longitude = Double.parseDouble(parts[4]);
                    LocalDate predictionDate = LocalDate.parse(parts[5]);

                    if (loc.equalsIgnoreCase(location) && predictionDate.equals(date)) {
                        HistoricalPrediction hp = new HistoricalPrediction();
                        hp.setLocation(loc);
                        hp.setDisasterType(disasterType);
                        hp.setSeverityScore(severity);
                        hp.setLatitude(latitude);
                        hp.setLongitude(longitude);
                        hp.setPredictionDate(predictionDate);
                        results.add(hp);
                    }
                } catch (Exception e) {
                    // Skip bad rows
                    continue;
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return results;
    }
}
