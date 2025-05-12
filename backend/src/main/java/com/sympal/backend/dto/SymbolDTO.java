package com.sympal.backend.dto;

import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

public class SymbolDTO {
    private String description;
    private String imageUrl;
    private List<String> categoryNames;

    public SymbolDTO() {
    }

    // Constructor
    public SymbolDTO(String description, String imageUrl,List<String> categoryNames ) {
        this.description = description;
        this.imageUrl = imageUrl;
        this.categoryNames = categoryNames;
//
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

    public List<String> getCategoryNames() {
        return categoryNames;
    }

    public void setCategoryNames(List<String> categoryNames) {
        this.categoryNames = categoryNames;
    }
//    public CategoryDTO getCategory() {
//        return category;
//    }
//
//    public void setCategory(CategoryDTO category) {
//        this.category = category;
//    }

    @Override
    public String toString() {
        return "SymbolDTO{" +
                "description='" + description + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", category="  +
                '}';
    }



}
