package com.example.warning_system.repository;

import com.example.warning_system.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    @Query("SELECT a.disasterType, COUNT(a) FROM Alert a GROUP BY a.disasterType")
    List<Object[]> countAlertsByDisasterType();

    @Query("SELECT a.disasterType, AVG(a.severityScore) FROM Alert a GROUP BY a.disasterType")
    List<Object[]> avgSeverityByDisasterType();
    List<Alert> findByDisasterTypeAndLocation(String disasterType, String location);
}
