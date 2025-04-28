package com.sympal.backend.dto;

public class CategoryDTO {
    private String name;

    // Constructor
    public CategoryDTO(String name) {
        this.name = name;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "CategoryDTO{" +
                "name='" + name + '\'' +
                '}';
    }
}
