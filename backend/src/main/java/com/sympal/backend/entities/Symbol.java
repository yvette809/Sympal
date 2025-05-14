package com.sympal.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "category")
public class Symbol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    @Column(name = "image_url", length = 5000)
    private String imageUrl;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "symbol_categories",
            joinColumns = @JoinColumn(name = "symbol_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )

    @JsonIgnore
    private List<Category> categories = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

}
