package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolDTO;
import com.sympal.backend.dto.SymbolRequest;
import com.sympal.backend.request.SymbolRequest;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.service.SymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symbols")
public class SymbolController {

    @Autowired
    private SymbolService symbolService;

    // 1. Generate symbol (DALL·E only — no saving)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate")
    public ResponseEntity<String> generateSymbol(@RequestParam String prompt) {
        String dalleImageUrl = symbolService.generateSymbol(prompt);
        return ResponseEntity.ok(dalleImageUrl);
    }

    // 2. Save symbol after user confirms
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/saveSymbol")
    public ResponseEntity<SymbolDTO> saveSymbol(@RequestBody SymbolDTO symbolDTO) {
        SymbolDTO saved = symbolService.saveSymbolWithCategories(symbolDTO);
        return ResponseEntity.ok(saved);
    }

}

