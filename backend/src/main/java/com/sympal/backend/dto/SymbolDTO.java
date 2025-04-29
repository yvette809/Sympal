package com.sympal.backend.dto;

import org.springframework.http.ResponseEntity;

import java.util.concurrent.CompletableFuture;

public class SymbolDTO {
    private String description;
    private String imageUrl;
    private CategoryDTO category;

    // Constructor
    public SymbolDTO(String description, String imageUrl, CategoryDTO category) {
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
    }

    // Getters and Setters
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "SymbolDTO{" +
                "description='" + description + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", category=" + category +
                '}';
    }


}
