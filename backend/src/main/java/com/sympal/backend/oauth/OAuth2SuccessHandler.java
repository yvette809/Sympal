package com.sympal.backend.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sympal.backend.entities.User;
import com.sympal.backend.repository.UserRepository;
import com.sympal.backend.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    private static final Logger logger = Logger.getLogger(OAuth2SuccessHandler.class.getName());

    public OAuth2SuccessHandler(JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String username = oAuth2User.getAttribute("name");

        logger.info("OAuth2 login success for: " + email);

        // ✅ Check if user exists, otherwise register them
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(username!=null? username:email);
            newUser.setRole("ROLE_USER");
            return userRepository.save(newUser);
        });
        if (user != null) {
            logger.info("User already exists: " + user.getEmail());
        }

        // ✅ Generate JWT
        String jwt = jwtUtil.generateToken(username);

        // ✅ JSON response
        Map<String, Object> tokenResponse = new HashMap<>();
        tokenResponse.put("status", "success");
        tokenResponse.put("token", jwt);
        tokenResponse.put("email", email);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_OK);
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.sendRedirect("http://localhost:3000/oauth2/success?token=" + jwt + "&email=" + email);

        objectMapper.writeValue(response.getWriter(), tokenResponse);
    }
}
