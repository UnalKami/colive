package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.service.AuthService;

import java.util.HashMap;
import java.util.Collections;
import java.util.Map;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDTO) {
        try {
            Map<String, Object> response = authService.login(loginDTO);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    
}