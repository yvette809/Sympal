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

    @ManyToMany(mappedBy = "categories")
    private List<Symbol> symbols = new ArrayList<>();

    public void addSymbol(Symbol symbol) {
        if (!symbols.contains(symbol)) {
            symbols.add(symbol);
            symbol.getCategories().add(this);
        }
    }

    public void removeSymbol(Symbol symbol) {
        symbols.remove(symbol);
        symbol.getCategories().remove(this);
    }

    // Extra konstruktor för enkel initiering
    public Category(String name, List<Symbol> symbols) {
        this.name = name;
        this.symbols = symbols;
    }
}
