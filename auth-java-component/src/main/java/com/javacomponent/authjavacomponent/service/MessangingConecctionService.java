package com.javacomponent.authjavacomponent.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;


import java.util.Map;
@Service
public class MessangingConecctionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String BASE_URL = "http://CL_messaging_ms:7000/msg/sesion";
    private final ObjectMapper objectMapper = new ObjectMapper();


    public String crearSesion(String token, Long idRol) {
        String url = BASE_URL + "/crear";
        Map<String, Object> request = Map.of("token", token, "idRol", idRol);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
        if(!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Error al crear la sesión: " + response.getStatusCode());
        }
        return response.getBody();
    }

    public Long sesionActiva(@PathVariable String token) {
        String url = BASE_URL + "/activo/" + token;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        // Retorna el mensaje recibido del microservicio (por ejemplo, JSON con idRol o error)
        try {
        // El microservicio retorna un JSON: {"idRol":"2"}
        String jsonResponse = response.getBody();
        JsonNode jsonNode = objectMapper.readTree(jsonResponse);
        String idRolStr = jsonNode.get("idRol").asText();
        return Long.parseLong(idRolStr);
    } catch (Exception e) {
        // Si hay error parseando o el token no es válido, retornar null
        return null;
    }
    }
}
