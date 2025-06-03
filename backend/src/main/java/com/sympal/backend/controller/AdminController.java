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

    @PostMapping("/approve-and-categorize/{requestId}")
    public ResponseEntity<?> approveAndCategorize(
            @PathVariable Long requestId,
            @RequestBody List<Long> categoryIds
    ) {
        SymbolRequest request = requestRepo.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));

        if (request.getStatus() != SymbolRequest.SymbolStatus.READY_FOR_APPROVAL) {
            return ResponseEntity.badRequest().body("Request not ready for approval");
        }

        // Save category IDs to the request
        request.setCategoryIds(categoryIds);
        requestRepo.save(request); // Optional here but ensures IDs are persisted

        // Fetch category objects
        List<Category> categories = categoryRepo.findAllById(categoryIds);

        // Create and save the symbol
        Symbol symbol = new Symbol();
        symbol.setDescription(request.getDescription());
        symbol.setImageUrl(request.getTempImageUrl());
        symbol.setApproved(true);
        symbol.setCategories(categories);
        symbol = symbolRepo.save(symbol);

        // Link symbol to request and update status
        request.setSymbol(symbol);
        request.setStatus(SymbolRequest.SymbolStatus.DONE);
        requestRepo.save(request);

        return ResponseEntity.ok("Symbol approved and categorized successfully");
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
