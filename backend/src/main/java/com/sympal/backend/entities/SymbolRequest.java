package com.sympal.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    private SymbolStatus  status;
    private LocalDateTime createdAt;
    private String tempImageUrl;

    @OneToOne
    private Symbol symbol;
    @ElementCollection
    private List<Long> categoryIds = new ArrayList<>();


    public enum SymbolStatus {
        PENDING,
        DONE,
        FAILED,
        READY_FOR_APPROVAL,
        RESUBMIT
    }

}
