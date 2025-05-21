package com.sympal.backend.repository;

import com.sympal.backend.entities.SymbolRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SymbolRequestRepository extends JpaRepository<SymbolRequest, Long> {
    List<SymbolRequest> findTop1ByStatus(String status);
    Optional<SymbolRequest> findByDescriptionIgnoreCase(String description);

}