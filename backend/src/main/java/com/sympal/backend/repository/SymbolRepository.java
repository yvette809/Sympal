package com.sympal.backend.repository;

import com.sympal.backend.entities.Symbol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SymbolRepository extends JpaRepository<Symbol, Long> {
}
