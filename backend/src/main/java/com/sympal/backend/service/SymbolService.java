package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.dto.CategoryDTO;
import com.sympal.backend.dto.SymbolDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SymbolService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CategoryService categoryService;

    @Autowired
    private SymbolRepository symbolRepository;

    @Autowired
    private DalleService dalleService;

    @Transactional
    public SymbolDTO generateAndSave(String prompt, String categoryName) {
        Category category = categoryService.findOrCreate(categoryName);
        String imageUrl = dalleService.generateImage(prompt);

        Symbol symbol = new Symbol();
        symbol.setDescription(prompt);
        symbol.setImageUrl(imageUrl);
        symbol.setCategory(category);

       // category.addSymbol(symbol);
        categoryRepository.save(category);
        CategoryDTO categoryDTO = convertCategoryToDTO(category);
        return new SymbolDTO(symbol.getDescription(), symbol.getImageUrl(), categoryDTO);
    }

    public String generateOnly(String prompt) {
        return dalleService.generateImage(prompt);
    }

    @Transactional
    public SymbolDTO saveConfirmedSymbol(SymbolDTO symbolDTO) {
        // Kontrollera eller skapa kategori
        Category category = categoryService.findOrCreate(symbolDTO.getCategory().getName());

        // Skapa symbol
        Symbol symbol = new Symbol();
        symbol.setDescription(symbolDTO.getDescription());
        symbol.setImageUrl(symbolDTO.getImageUrl());
        symbol.setCategory(category);

        category.addSymbol(symbol);
        categoryRepository.save(category);

        return new SymbolDTO(symbol.getDescription(), symbol.getImageUrl(), new CategoryDTO(category.getName()));
    }



    // Helper method to convert Category entity to CategoryDTO
    private CategoryDTO convertCategoryToDTO(Category category) {
        return new CategoryDTO(category.getName());
    }

}
