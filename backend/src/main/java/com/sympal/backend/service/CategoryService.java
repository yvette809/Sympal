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
        List<Category> categories = categoryRepository.findAll();
        System.out.println("categories" + categories);
        return categories;
        //return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Symbol> getSymbolsByCategoryId(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .map(Category::getSymbols)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

}

