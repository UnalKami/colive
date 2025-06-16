package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> login(LoginRequestDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol().getNombreRol());

        Map<String, Object> userData = new HashMap<>();
        userData.put("USUARIO_ID_Usuario", usuario.getIdUsuario());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", token);
        responseBody.put("rol", usuario.getRol().getNombreRol());
        responseBody.put("user", Collections.singletonList(userData));

        Map<String, Object> finalResponse = new HashMap<>();
        finalResponse.put("body", responseBody);

        return finalResponse;
    }

}
