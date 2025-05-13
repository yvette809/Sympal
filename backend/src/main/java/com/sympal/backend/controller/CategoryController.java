package com.sympal.backend.controller;

import com.sympal.backend.entities.Category;
import com.sympal.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // GET all categories
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    // POST a new category
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        try {
            Category created = categoryService.createCategory(category);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // PUT to update an existing category
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        try {
            Category updated = categoryService.updateCategory(id, updatedCategory);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE a category and related symbols (if applicable)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build(); // HTTP 204
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Optional: GET symbols for a given category
    @GetMapping("/{id}/symbols")
    public ResponseEntity<?> getSymbolsByCategoryId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(categoryService.getSymbolsByCategoryId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
