package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/registro")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> registrarAdmin(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.ADMIN_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/propietario")
    public ResponseEntity<Map<String, Object>> registrarPropietario(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.PROPIEDAD_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/residente")
    public ResponseEntity<Map<String, Object>> registrarRecidente(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.RESIDENTE_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/seguridad")
    public ResponseEntity<Map<String, Object>> registrarSeguridad(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.SEGURIDAD_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mantenimiento")
    public ResponseEntity<Map<String, Object>> registrarMantenimiento(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.MANTENIMIENTO_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/aseo")
    public ResponseEntity<Map<String, Object>> registrarAseo(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.ASEO_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    @DeleteMapping("/usuario/{id}")
    public ResponseEntity<Map<String, Object>> eliminarUsuario(@PathVariable Long id) {
        try {
            registroService.eliminarUsuario(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}