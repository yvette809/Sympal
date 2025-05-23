package com.sympal.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymbolRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    @Enumerated(EnumType.STRING)
    private SymbolStatus  status; // PENDING, DONE, FAILED
    private LocalDateTime createdAt;

    @OneToOne
    private Symbol symbol;


    public enum SymbolStatus {
        PENDING,
        DONE,
        FAILED,
        RESUBMIT
    }

}
