package com.sympal.backend.repository;

import com.sympal.backend.entities.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {
    Optional<Symbol> findByDescription(String description);
}
