package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolRequestUpdateDto;
import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.entities.SymbolRequest;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.repository.SymbolRequestRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SymbolRepository symbolRepo;
    private final CategoryRepository categoryRepo;
    private final SymbolRequestRepository symbolRequestRepository;

    @PostMapping("/approve/{id}")
    public ResponseEntity<Void> approveSymbol(@PathVariable Long id) {
        Symbol symbol = symbolRepo.findById(id).orElseThrow();
        symbol.setApproved(true);
        symbolRepo.save(symbol);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/categorize/{symbolId}")
    public ResponseEntity<Void> categorize(
            @PathVariable Long symbolId,
            @RequestBody List<Long> categoryIds
    ) {
        Symbol symbol = symbolRepo.findById(symbolId).orElseThrow();
        List<Category> categories = categoryRepo.findAllById(categoryIds);
        symbol.setCategories(categories);
        symbolRepo.save(symbol);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/symbols")
    public List<SymbolRequest> getGeneratedSymbols() {
        return symbolRequestRepository.findByStatus(SymbolRequest.SymbolStatus.DONE);
    }

    @PatchMapping("/symbol-requests/{id}/requeue")
    public ResponseEntity<SymbolRequest> sendBackToQueue(
            @PathVariable Long id,
            @RequestBody(required = false) SymbolRequestUpdateDto updateDto
    ) {
        return symbolRequestRepository.findById(id).map(request -> {
            request.setStatus(SymbolRequest.SymbolStatus.PENDING);
            if (updateDto != null && updateDto.getDescription() != null) {
                request.setDescription(updateDto.getDescription());
            }
            request.setSymbol(null);
            return ResponseEntity.ok(symbolRequestRepository.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }


}
