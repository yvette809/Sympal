package com.sympal.backend.security;

import com.sympal.backend.entities.User;
import com.sympal.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository repo;

    public CustomOAuth2UserService(UserRepository repo) {
        this.repo = repo;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User user = super.loadUser(request);
        Map<String, Object> attrs = user.getAttributes();
        String email = (String) attrs.get("email");

        repo.findByUsername(email).orElseGet(() -> {
            User u = new User();
            u.setUsername(email);
            u.setRole("ROLE_USER");
            u.setProvider("google");
            repo.save(u);
            return u;
        });

        return user;
    }
}
