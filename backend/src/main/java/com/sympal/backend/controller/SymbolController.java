package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolRequest;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.service.SymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symbols")
public class SymbolController {

    @Autowired
    private SymbolService symbolService;

    // 1. Generate symbol (DALL·E only — no saving)
    @PostMapping("/generate")
    public ResponseEntity<String> generateSymbol(@RequestParam String prompt) {
        String dalleImageUrl = symbolService.generateSymbol(prompt);
        return ResponseEntity.ok(dalleImageUrl);
    }

    // 2. Save symbol after user confirms
    @PostMapping("/saveSymbol")
    public ResponseEntity<Symbol> saveSymbol(@RequestBody SymbolRequest request) {
        String prompt = request.getPrompt();
        String categoryName = request.getCategoryName();

        Symbol saved = symbolService.saveConfirmedSymbol(prompt, categoryName);
        return ResponseEntity.ok(saved);
    }

}
