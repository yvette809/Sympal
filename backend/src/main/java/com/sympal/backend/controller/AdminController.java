package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolRequestUpdateDto;
import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.entities.SymbolRequest;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.repository.SymbolRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final SymbolRepository symbolRepo;
    private final CategoryRepository categoryRepo;
    private final SymbolRequestRepository requestRepo;

    @PostMapping("/approve/{requestId}")
    public ResponseEntity<?> approveRequest(@PathVariable Long requestId) {
        SymbolRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        if (request.getStatus() != SymbolRequest.SymbolStatus.READY_FOR_APPROVAL) {
            return ResponseEntity.badRequest().body("Request not ready for approval");
        }

        // Fetch categories from IDs stored in SymbolRequest
        List<Category> categories = categoryRepo.findAllById(request.getCategoryIds());

        Symbol symbol = new Symbol();
        symbol.setDescription(request.getDescription());
        symbol.setImageUrl(request.getTempImageUrl());
        symbol.setApproved(true);
        symbol.setCategories(categories);
        symbol = symbolRepo.save(symbol);

        request.setSymbol(symbol);
        request.setStatus(SymbolRequest.SymbolStatus.DONE);
        requestRepo.save(request);

        return ResponseEntity.ok("Approved and saved");
    }


    @PostMapping("/categorize/{requestId}")
    public ResponseEntity<Void> categorize(
            @PathVariable Long requestId,
            @RequestBody List<Long> categoryIds
    ) {
        SymbolRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new RuntimeException("SymbolRequest not found"));

        request.setCategoryIds(categoryIds); // Store the category IDs
        requestRepo.save(request);

        return ResponseEntity.ok().build();
    }


    @GetMapping("/symbols")
    public List<SymbolRequest> getGeneratedSymbols() {
        return requestRepo.findByStatus(SymbolRequest.SymbolStatus.READY_FOR_APPROVAL);
    }

    @PatchMapping("/symbol-requests/{id}/requeue")
    public ResponseEntity<SymbolRequest> sendBackToQueue(
            @PathVariable Long id,
            @RequestBody(required = false) SymbolRequestUpdateDto updateDto
    ) {
        return requestRepo.findById(id).map(request -> {
            request.setStatus(SymbolRequest.SymbolStatus.PENDING);
            if (updateDto != null && updateDto.getDescription() != null) {
                request.setDescription(updateDto.getDescription());
            }
            request.setSymbol(null);
            return ResponseEntity.ok(requestRepo.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }
}
