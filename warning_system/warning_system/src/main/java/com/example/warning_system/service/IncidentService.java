package com.example.warning_system.service;

import com.example.warning_system.model.Incident;
import com.example.warning_system.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository repo;

    public IncidentService(IncidentRepository repo) {
        this.repo = repo;
    }

    public Incident createIncident(Incident inc, Long userId) {
        inc.setUserId(userId);
        inc.setStatus("PENDING");
        inc.setTimestamp(LocalDateTime.now());
        return repo.save(inc);
    }

    public List<Incident> getPendingIncidents() {
        return repo.findByStatus("PENDING");
    }

    public List<Incident> getByUserId(Long userId) {
        return repo.findByUserId(userId);
    }

    public Incident updateStatus(Long id, String status) {
        Incident inc = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found"));
        inc.setStatus(status);
        return repo.save(inc);
    }
}
