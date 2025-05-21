package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
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
            registroService.registrarAdmin(dto);
            return ResponseEntity.ok("Registro exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}