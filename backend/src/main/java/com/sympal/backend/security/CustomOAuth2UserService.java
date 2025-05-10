package com.sympal.backend.security;

import com.sympal.backend.entities.User;
import com.sympal.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.*;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public CustomOAuth2UserService(UserRepository repo,  PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User user = super.loadUser(request);
        Map<String, Object> attrs = user.getAttributes();
        String email = (String) attrs.get("email");
        String picture = (String) attrs.get("picture");
        String name = (String)attrs.get("name");

        repo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
           u.setUsername( name !=null? name : email);

            // ✅ Generate dummy password
            String dummyPassword = passwordEncoder.encode(UUID.randomUUID().toString());
           u.setPassword(dummyPassword);
          u.setProfileImageUrl(picture);
            u.setRole("ROLE_USER");
            u.setProvider("google");
            repo.save(u);
            return u;
        });

        return user;
    }
}
