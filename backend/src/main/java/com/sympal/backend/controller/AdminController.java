package com.sympal.backend.controller;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SymbolRepository symbolRepo;
    private final CategoryRepository categoryRepo;

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
}
