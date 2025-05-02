package com.sympal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DalleService {

    @Value("${openai.api.key}")
    private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String DALL_E_URL = "https://api.openai.com/v1/images/generations";

    public String generateImage(String prompt) {
        System.out.println("System ENV: " + System.getenv("OPENAI_API_KEY"));

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("OpenAI-Organization", "org-CRgNRF1PQzZySlDRdu2GRQrP");

        String styledPrompt = "A minimalist black and white pictogram of " + prompt +
                ", centered inside a white square frame. The icon itself is solid black with clean lines and no background. " +
                "Do not use a black background. High contrast.";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("prompt", styledPrompt);
        requestBody.put("n", 1);
        requestBody.put("size", "256x256");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                DALL_E_URL,
                HttpMethod.POST,
                request,
                Map.class
        );

        System.out.println("response: " + response.getBody());

        Map<String, Object> body = response.getBody();
        if (body == null || !body.containsKey("data")) {
            throw new RuntimeException("Failed to generate image: invalid response");
        }

        List<Map<String, String>> data = (List<Map<String, String>>) body.get("data");
        if (data.isEmpty() || !data.get(0).containsKey("url")) {
            throw new RuntimeException("Failed to generate image: no image URL found");
        }

        return data.get(0).get("url");
    }
}
