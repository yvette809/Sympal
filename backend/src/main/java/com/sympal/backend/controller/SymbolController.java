package com.sympal.backend.controller;

import com.sympal.backend.dto.SymbolDTO;
import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.service.CategoryService;
import com.sympal.backend.service.SymbolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/symbols")
public class SymbolController {

    @Autowired
    private SymbolService symbolService;
    @Autowired
    private CategoryService categoryService;

    // DTO to receive prompt and category
    public static class SymbolRequest {
        public String prompt;
        public String category;
    }


  /*  @PostMapping("/generate")
    public Symbol generateSymbol(@RequestBody SymbolRequest request) {
        return symbolService.generateAndSave(request.prompt, request.category);
    } */

//    @PostMapping("/generate")
//    public SymbolDTO generateSymbol(@RequestBody SymbolRequest request) {
//        System.out.println("Received Request: " + request);  // Log the request
//        // Fetch the Category entity by name
//        Category category = categoryService.findOrCreate(request.category);
//
//        if (category == null) {
//            throw new IllegalArgumentException("Category not found");
//        }
//
//        // Pass the category entity to the service
//      SymbolDTO symbol =  symbolService.generateAndSave(request.prompt, category.getName());
//        System.out.println("Generated symbol: " + symbol);
//        return symbol;
//    }

    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody String prompt) {
        String imageUrl = symbolService.generateOnly(prompt);
        return ResponseEntity.ok(imageUrl);
    }

    @PostMapping("/save")
    public ResponseEntity<SymbolDTO> save(@RequestBody SymbolDTO dto) {
        SymbolDTO saved = symbolService.saveConfirmedSymbol(dto);
        return ResponseEntity.ok(saved);

    @PostMapping("/generate")
    public SymbolDTO generateSymbol(@RequestBody SymbolRequest request) {
        Category category = categoryService.findOrCreate(request.category);

        if (category == null) {
            throw new IllegalArgumentException("Category not found");
        }

        // Pass the category entity to the service
        SymbolDTO symbol =  symbolService.generateAndSave(request.prompt, category.getName());
        System.out.println("Generated symbol: " + symbol);
        return symbol;

    }


}

