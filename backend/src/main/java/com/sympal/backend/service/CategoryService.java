package com.sympal.backend.service;

import com.sympal.backend.entities.Category;
import com.sympal.backend.entities.Symbol;
import com.sympal.backend.repository.CategoryRepository;
import com.sympal.backend.repository.SymbolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SymbolRepository symbolRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, SymbolRepository symbolRepository) {
        this.categoryRepository = categoryRepository;
        this.symbolRepository = symbolRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();

    }

    // Skapa ny kategori
    public Category createCategory(Category category) {
        if (category.getIcon() == null || category.getIcon().isBlank()) {
            String emoji = fetchEmojiForCategory(category.getName());
            category.setIcon(emoji);
        }
        return categoryRepository.save(category);
    }


    // Hämta symboler för en viss kategori
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

    public Category findOrCreate(String categoryName) {
        Category category = categoryRepository.findByName(categoryName);
        if (category == null) {
            category = new Category();
            category.setName(categoryName);
            categoryRepository.save(category);
        }
        return category;
    }
    @Value("${openai.api.key}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String fetchEmojiForCategory(String categoryName) {
        String prompt = "Return a single emoji that represents the category: \"" + categoryName + "\". Only return the emoji, nothing else.";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openAiApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(message),
                "max_tokens", 10,
                "temperature", 0.5
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    request,
                    Map.class
            );

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> firstChoice = choices.get(0);
                Map<String, Object> messageMap = (Map<String, Object>) firstChoice.get("message");
                String content = messageMap.get("content").toString().trim();
                if (!content.isEmpty()) return content;
            }

        } catch (Exception e) {
            System.err.println("Failed to fetch emoji from OpenAI: " + e.getMessage());
        }

        return "📁"; // fallback emoji
    }
}
