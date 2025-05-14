package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolDTO;
import com.sympal.backend.request.SymbolRequest;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.entities.Category;
import com.sympal.backend.service.SymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/saveSymbol")
    public ResponseEntity<SymbolDTO> saveSymbol(@RequestBody SymbolDTO symbolDTO) {
        try {
            // Call the service to save the symbol with categories
            Symbol symbol = symbolService.saveSymbolWithCategories(
                    symbolDTO.getDescription(),
                    symbolDTO.getCategoryNames(),
                    symbolDTO.getImageUrl()
            );

            // Convert the saved symbol to SymbolDTO for the response
            List<String> categoryNames = symbol.getCategories().stream()
                    .map(Category::getName)
                    .collect(Collectors.toList());

            SymbolDTO savedSymbolDTO = new SymbolDTO(
                    symbol.getDescription(),
                    symbol.getImageUrl(),
                    categoryNames
            );

            return new ResponseEntity<>(savedSymbolDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

