package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SymbolRepository symbolRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, SymbolRepository symbolRepository) {
        this.categoryRepository = categoryRepository;
        this.symbolRepository = symbolRepository;
    }

    public Category findOrCreate(String categoryName) {
        Category category = categoryRepository.findByName(categoryName);
        if (category == null) {
            category = new Category();
            category.setName(categoryName);
            categoryRepository.save(category);
        }
        return category;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Symbol> getSymbolsByCategoryId(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(Category::getSymbols)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category updateCategory(Long id, Category updatedCategory) {
        return categoryRepository.findById(id).map(existingCategory -> {
            existingCategory.setName(updatedCategory.getName());
            existingCategory.setIcon(updatedCategory.getIcon());
            return categoryRepository.save(existingCategory);
        }).orElseThrow(() -> new RuntimeException("Category not found"));
    }


    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        List<Symbol> symbolsToDelete = category.getSymbols();
        symbolRepository.deleteAll(symbolsToDelete);
        categoryRepository.delete(category);
    }
}
