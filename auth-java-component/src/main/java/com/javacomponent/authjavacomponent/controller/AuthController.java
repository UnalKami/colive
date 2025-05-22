package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDTO) {
        try {
            String mensaje = authService.login(loginDTO);
            return ResponseEntity.ok(mensaje);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}