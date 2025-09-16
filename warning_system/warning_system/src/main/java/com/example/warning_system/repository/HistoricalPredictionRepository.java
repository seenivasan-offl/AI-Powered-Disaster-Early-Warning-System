package com.example.warning_system.repository;

import com.example.warning_system.model.HistoricalPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface HistoricalPredictionRepository extends JpaRepository<HistoricalPrediction, Long> {
    List<HistoricalPrediction> findByLocationAndPredictionDate(String location, LocalDate predictionDate);
}
