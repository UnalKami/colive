package com.javacomponent.authjavacomponent.controller;

import com.javacomponent.authjavacomponent.dto.LoginRequest;
import com.javacomponent.authjavacomponent.dto.NuevaPasswordRequest;
import com.javacomponent.authjavacomponent.dto.UsuarioDTO;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/crear-usuario-invitado")
    public ResponseEntity<?> crearUsuarioInvitado(@RequestBody UsuarioDTO usuarioDTO) {
        if (usuarioRepository.existsByCorreo(usuarioDTO.getCorreo())) {
            return ResponseEntity.badRequest().body("Correo ya registrado");
        }

        Usuario nuevo = new Usuario();
        nuevo.setCorreo(usuarioDTO.getCorreo());
        nuevo.setRol(usuarioDTO.getRol());
        nuevo.setContraseña(null);
        nuevo.setVerificado(false);
        nuevo.setTokenVerificacion(UUID.randomUUID().toString());

        usuarioRepository.save(nuevo);

        String url = "http://localhost/auth/definir-password?token=" + nuevo.getTokenVerificacion();
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/definir-password")
    public ResponseEntity<?> definirPassword(@RequestBody NuevaPasswordRequest request) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findByTokenVerificacion(request.getToken());

        if (optionalUsuario.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token inválido");
        }

        Usuario usuario = optionalUsuario.get();

        if (usuario.getVerificado()) {
            return ResponseEntity.badRequest().body("Cuenta ya activada");
        }

        usuario.setContraseña(passwordEncoder.encode(request.getNuevaPassword())); // ✅ encriptado
        usuario.setVerificado(true);
        usuario.setTokenVerificacion(null);

        usuarioRepository.save(usuario);

        return ResponseEntity.ok("Contraseña definida y cuenta activada");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getContraseña())
            );

            User user = (User) auth.getPrincipal();
            String token = jwtUtil.generateToken(user.getUsername(), user.getAuthorities().toString());

            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }
}
