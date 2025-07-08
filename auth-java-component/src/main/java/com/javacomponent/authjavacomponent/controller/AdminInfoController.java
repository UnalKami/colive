package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.security.JwtUtil;
import com.javacomponent.authjavacomponent.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AdminInfoController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    @GetMapping("/admin-info")
    public ResponseEntity<Map<String, Object>> getAdminInfo(HttpServletRequest request) {
        try {
            // Extraer token de la cookie
            String token = extractTokenFromCookie(request);
            
            if (token == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token no encontrado"));
            }

            // Obtener información del admin desde el token
            Map<String, Object> adminInfo = authService.getAdminInfoFromToken(token);
            
            return ResponseEntity.ok(adminInfo);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("authToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}