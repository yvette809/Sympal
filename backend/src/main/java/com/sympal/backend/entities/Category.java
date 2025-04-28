package com.sympal.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "symbols")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Symbol> symbols = new ArrayList<>();

    public void addSymbol(Symbol symbol) {
        if (symbols == null) {
            symbols = new ArrayList<>();
        }
        symbols.add(symbol);
    }

    public void removeSymbol(Symbol symbol) {
        symbols.remove(symbol);
        symbol.setCategory(null);
    }


}
