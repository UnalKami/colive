package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
import com.javacomponent.authjavacomponent.model.Persona;
import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.PersonaRepository;
import com.javacomponent.authjavacomponent.repository.RolRepository;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class RegistroService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Map<String, Object> registrarUsuario(RegistroRequestDTO dto, Long rolId) {
        if (usuarioRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("El username: "+dto.getUsername()+" ya está en uso");
        }

        Rol rol = rolRepository.findById(rolId)
                .orElseThrow(() -> new RuntimeException("El rol con id: "+rolId+" no fue encontrado"));

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(dto.getUsername());
        nuevoUsuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        nuevoUsuario.setRol(rol);
        usuarioRepository.save(nuevoUsuario);

        Persona persona = new Persona();
        persona.setNombre(dto.getNombre());
        persona.setCorreo(dto.getCorreo());
        persona.setCelular(dto.getCelular());
        persona.setUsuario(nuevoUsuario);
        personaRepository.save(persona);

        Map<String, Object> response = new HashMap<>();
        response.put("usuarioId", nuevoUsuario.getIdUsuario());
        return response;
    }
}