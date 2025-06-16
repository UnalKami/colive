package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.service.AuthService;

import java.util.HashMap;
import java.util.Collections;
import java.util.Map;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/login")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginDTO, HttpServletResponse response) {
        try {
            Map<String, Object> resp = authService.login(loginDTO, response);
            for (String headerName : response.getHeaderNames()) {
            System.out.println(headerName + ": " + response.getHeader(headerName));
            }
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    
}