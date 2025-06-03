package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registro")
public class RegistroController {

    @Autowired
    private RegistroService registroService;

    @PostMapping("/admin")
    public ResponseEntity<String> registrarAdmin(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.ADMIN_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/propietario")
    public ResponseEntity<String> registrarPropietario(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.PROPIEDAD_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/recidente")
    public ResponseEntity<String> registrarRecidente(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.RESIDENTE_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/seguridad")
    public ResponseEntity<String> registrarSeguridad(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.SEGURIDAD_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/mantenimiento")
    public ResponseEntity<String> registrarMantenimiento(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.MANTENIMIENTO_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/aseo")
    public ResponseEntity<String> registrarAseo(@RequestBody RegistroRequestDTO dto) {
        try {
            registroService.registrarUsuario(dto, Rol.ASEO_CR);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}