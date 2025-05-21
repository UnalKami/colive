package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.ApartamentoBatchRequestDTO;
import com.javacomponent.authjavacomponent.dto.ConjuntoResidencialRequestDTO;
import com.javacomponent.authjavacomponent.service.ApartamentoService;
import com.javacomponent.authjavacomponent.service.ConjuntoResidencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/crear")
public class CrearController {

    @Autowired
    private ConjuntoResidencialService conjuntoService;

    @Autowired
    private ApartamentoService apartamentoService;

    @PostMapping("/conjunto")
    public ResponseEntity<String> crearConjunto(@RequestBody ConjuntoResidencialRequestDTO dto) {
        try {
            conjuntoService.crearConjunto(dto);
            return ResponseEntity.ok("Creación exitosa");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/apartamentos")
    public ResponseEntity<String> crearApartamentos(@RequestBody ApartamentoBatchRequestDTO dto) {
        try {
            apartamentoService.crearApartamentos(dto);
            return ResponseEntity.ok("Apartamentos creados correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}