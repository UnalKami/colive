package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.ConjuntoResidencialRequestDTO;
import com.javacomponent.authjavacomponent.service.ConjuntoResidencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crear")
public class CrearController {

    @Autowired
    private ConjuntoResidencialService conjuntoService;

    @PostMapping("/conjunto")
    public ResponseEntity<String> crearConjunto(@RequestBody ConjuntoResidencialRequestDTO dto) {
        try {
            conjuntoService.crearConjunto(dto);
            return ResponseEntity.ok("Creación exitosa");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}