package com.sympal.backend.service;

import com.sympal.backend.dto.SymbolDTO;
import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @Autowired
    private CloudinaryService cloudinaryService;

    public String generateSymbol(String prompt){
        Optional<Symbol> existing = symbolRepository.findByDescription(prompt);
        if (existing.isPresent()) {
            return existing.get().getImageUrl();
        }
        return dalleService.generateImage(prompt);
    }

    public Symbol saveSymbolWithCategories (String prompt, List<String> categoryNames, String dalleImageUrl) {
        byte[] imageBytes = downloadImage(dalleImageUrl);
        String fileName = UUID.randomUUID().toString();
        String uploadedUrl = cloudinaryService.uploadImage(imageBytes, fileName);

        Symbol symbol = new Symbol();
        symbol.setDescription(prompt);
        symbol.setImageUrl(uploadedUrl);

        // Map the category names to Category entities, create them if they don't exist
        List<Category> categories = categoryNames.stream()
                .map(name -> categoryService.findOrCreate(name)) // Find or create category
                .collect(Collectors.toList());

        symbol.setCategories(categories);

        return symbolRepository.save(symbol);
    }

    // Helper method to download image from DALL·E (or other service)
    public byte[] downloadImage(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream()) {
            return in.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException("Failed to download image", e);
        }
    }




}
