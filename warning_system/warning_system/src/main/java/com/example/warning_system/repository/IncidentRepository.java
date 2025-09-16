package com.example.warning_system.repository;

import com.example.warning_system.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByUserId(Long userId);
    List<Incident> findByStatus(String status);
    List<Incident> findByDisasterType(String disasterType);
    List<Incident> findBySeverityBetween(Double min, Double max);
}
