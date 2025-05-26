package com.sympal.backend.controller;

import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.repository.SymbolRequestRepository;
import com.sympal.backend.entities.SymbolRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/requests")
public class SymbolRequestController {

    private final SymbolRequestRepository requestRepo;
    private final SymbolRepository symbolRepo;

    @Autowired
    public SymbolRequestController(SymbolRequestRepository requestRepo, SymbolRepository symbolRepo) {
        this.requestRepo = requestRepo;
        this.symbolRepo = symbolRepo;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestParam String description) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";

        log.info("User '{}' requested to create symbol for description: '{}'", username, description);

        String trimmedDesc = description.trim();

        // 1. Check in Symbol table first
        Optional<Symbol> existingSymbolOpt = symbolRepo.findByDescription(trimmedDesc);
        if (existingSymbolOpt.isPresent()) {
            Symbol symbol = existingSymbolOpt.get();
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("imageUrl", symbol.getImageUrl());
            responseBody.put("message", "Symbol found in symbol database");
            return ResponseEntity.ok(responseBody);
        }

        // No existing symbol or request — create new request
        SymbolRequest newRequest = new SymbolRequest();
        newRequest.setDescription(trimmedDesc);
        newRequest.setStatus(SymbolRequest.SymbolStatus.PENDING);
        newRequest.setCreatedAt(LocalDateTime.now());
        requestRepo.save(newRequest);

        log.info("New symbol request saved for description: '{}' by user '{}'", trimmedDesc, username);
        return ResponseEntity.accepted().build();
    }



    @GetMapping("/{description}/status")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable String description) {
        log.info("Checking status for description: '{}'", description);

        return requestRepo.findByDescriptionIgnoreCase(description.trim())
                .map(request -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("word", request.getDescription());
                    response.put("status", request.getStatus());

                    if (request.getStatus() == SymbolRequest.SymbolStatus.READY_FOR_APPROVAL) {
                        response.put("imageUrl", request.getTempImageUrl());

                    }

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    log.warn("No symbol request found for description: '{}'", description);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }

}
