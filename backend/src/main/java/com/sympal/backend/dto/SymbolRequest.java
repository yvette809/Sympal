package com.sympal.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// SymbolRequest.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SymbolRequest {
    private String prompt;
    private String categoryName;

}
