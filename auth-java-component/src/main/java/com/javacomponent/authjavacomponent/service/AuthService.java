package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String login(LoginRequestDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        return "Inicio de sesión exitoso para " + usuario.getUsername();
    }
}