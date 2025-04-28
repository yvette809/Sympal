package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import com.sympal.backend.dto.CategoryDTO;
import com.sympal.backend.dto.SymbolDTO;
import org.springframework.beans.factory.annotation.Autowired;
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
        // Step 1: Find or create the Category
        Category category = categoryService.findOrCreate(categoryName);
        System.out.println("category" + category);

        // Step 2: Generate image using DALL·E
        String imageUrl = dalleService.generateImage(prompt);

        // Step 3: Create a new Symbol and associate it with the Category
        Symbol symbol = new Symbol();
        symbol.setDescription(prompt);
        symbol.setImageUrl(imageUrl);
        symbol.setCategory(category);  // Associate category with symbol

        // Step 4: Add the Symbol to the Category (if necessary)
        category.addSymbol(symbol);

        // Step 5: Save the Category, which will cascade the save to Symbols
        categoryRepository.save(category);

        // Step 6: Convert Category to CategoryDTO (for the frontend)
        CategoryDTO categoryDTO = convertCategoryToDTO(category);

        // Step 7: Create and return SymbolDTO with CategoryDTO
        return new SymbolDTO(symbol.getDescription(), symbol.getImageUrl(), categoryDTO);
    }

    // Helper method to convert Category entity to CategoryDTO
    private CategoryDTO convertCategoryToDTO(Category category) {
        return new CategoryDTO(category.getName());
    }

}
