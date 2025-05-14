package com.sympal.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@ToString(exclude = "symbols")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(nullable = false, unique = true)
    private String name;

    private String icon;

    @ManyToMany(mappedBy = "categories")
    private List<Symbol> symbols = new ArrayList<>();

    // Optional custom constructor if needed
    public Category(String name, List<Symbol> symbols) {
        this.name = name;
        this.symbols = symbols;
    }
}
