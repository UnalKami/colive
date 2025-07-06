package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.UsuarioConjuntoDTO;
import com.javacomponent.authjavacomponent.service.RegistroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuario-conjunto")
public class UsuarioConjuntoController {

    @Autowired
    private RegistroService registroService;

    @PostMapping("/asociar")
    public ResponseEntity<Map<String, Object>> asociarUsuarioConjunto(@RequestBody UsuarioConjuntoDTO dto) {
        try {
            registroService.asociarUsuarioConjunto(dto.getUsuarioId(), dto.getConjuntoResidencialId());
            return ResponseEntity.ok(Map.of("mensaje", "Asociación creada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}