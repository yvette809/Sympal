package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.dto.CategoryDTO;
import com.sympal.backend.dto.SymbolDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.net.URL;
import java.util.Optional;
import java.util.UUID;

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

   /* @Transactional
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

    // Helper method to convert Category entity to CategoryDTO
    private CategoryDTO convertCategoryToDTO(Category category) {
        return new CategoryDTO(category.getName());
    }*/

    @Autowired
    private CloudinaryService cloudinaryService;

    public Symbol generateAndSave(String prompt, String categoryName) {
        Optional<Symbol> existing = symbolRepository.findByDescription(prompt);
        if (existing.isPresent()) {
            return existing.get(); // Return existing image
        }
        Category category = categoryService.findOrCreate(categoryName);
        String dalleUrl = dalleService.generateImage(prompt);

        byte[] imageBytes = downloadImage(dalleUrl);
        String fileName = UUID.randomUUID().toString();

        String uploadedUrl = cloudinaryService.uploadImage(imageBytes, fileName);

        Symbol symbol = new Symbol();
        symbol.setDescription(prompt);
        symbol.setImageUrl(uploadedUrl);
        symbol.setCategory(category);

        return symbolRepository.save(symbol);
    }

    // helper method to download image from dalle
    public byte[] downloadImage(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to download image", e);
        }
    }


}
