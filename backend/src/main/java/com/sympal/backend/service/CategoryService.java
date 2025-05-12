package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Skapa eller hitta kategori med tilldelade symboler
    public Category findOrCreate(String categoryName, List<Symbol> symbols) {
        return categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.save(new Category(categoryName, symbols)));
    }

    // Hämta alla kategorier
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        System.out.println("categories: " + categories);
        return categories;
    }

    // Skapa ny kategori
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Hämta symboler för en viss kategori
    public List<Symbol> getSymbolsByCategoryId(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(Category::getSymbols)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }
}
