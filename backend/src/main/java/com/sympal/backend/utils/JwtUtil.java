package com.sympal.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate token with username as subject and role as claim
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", role);
        claims.put("username", username);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)  // <-- use username as subject
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Validate token by comparing extracted username with userDetails' username
    public boolean validateToken(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Extract username from JWT (subject)
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // Extract roles claim from JWT
    public List<String> extractRoles(String token) {
        String roles = (String) extractAllClaims(token).get("roles");
        return Arrays.asList(roles.split(","));
    }

    // Check if token is expired
    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    // Parse and extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
