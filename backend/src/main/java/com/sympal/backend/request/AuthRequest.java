package com.sympal.backend.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthRequest {
    private String Email;
    private String username;
    private String password;
    private String profile;


}
