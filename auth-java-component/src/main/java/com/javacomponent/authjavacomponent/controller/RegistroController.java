package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.service.MessangingConecctionService;
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

    @Autowired
    private MessangingConecctionService messagingController;

    @PostMapping("/admin")
    public ResponseEntity<Map<String, Object>> registrarAdmin(@RequestBody RegistroRequestDTO dto) {
        try {
            Map<String, Object> response = registroService.registrarUsuario(dto, Rol.ADMIN_CR);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, Object>> registrarUsuarioConToken(
            @RequestBody RegistroRequestDTO dto,
            @RequestParam("token") String token) {
        try {
            // Puedes usar el token aquí si lo necesitas
            //TODO llamar al servicio para obtener id del rol
            Long rolId =  messagingController.sesionActiva(token);
            Map<String, Object> response = registroService.registrarUsuario(dto, rolId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/crearQR/{idRol}")
    public ResponseEntity<Map<String, Object>> crearQr(@PathVariable Integer idRol) {
        try {
            String token = registroService.crearToken(idRol);
            String mensaje = messagingController.crearSesion(token, Long.valueOf(idRol));
            Map<String, Object> response = Map.of(
                    "token", token,
                    "mensaje", mensaje
            );
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