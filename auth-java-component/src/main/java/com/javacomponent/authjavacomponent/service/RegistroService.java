package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.RegistroRequestDTO;
import com.javacomponent.authjavacomponent.model.Persona;
import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.PersonaRepository;
import com.javacomponent.authjavacomponent.repository.RolRepository;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.model.UsuarioConjunto;
import com.javacomponent.authjavacomponent.model.ConjuntoResidencial;
import com.javacomponent.authjavacomponent.repository.UsuarioConjuntoRepository;
import com.javacomponent.authjavacomponent.repository.ConjuntoResidencialRepository;
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

    @Autowired
    private UsuarioConjuntoRepository usuarioConjuntoRepository;

    @Autowired
    private ConjuntoResidencialRepository conjuntoResidencialRepository;

    public void asociarUsuarioConjunto(Long usuarioId, Long conjuntoResidencialId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario con id " + usuarioId + " no encontrado"));

        ConjuntoResidencial conjunto = conjuntoResidencialRepository.findById(conjuntoResidencialId)
                .orElseThrow(() -> new RuntimeException("Conjunto con id " + conjuntoResidencialId + " no encontrado"));

        UsuarioConjunto usuarioConjunto = new UsuarioConjunto();
        usuarioConjunto.setUsuario(usuario);
        usuarioConjunto.setConjuntoResidencial(conjunto);

        usuarioConjuntoRepository.save(usuarioConjunto);
    }

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
    public void eliminarUsuario(Long idUsuario) {
    // Buscar el usuario por ID
    Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new RuntimeException("Usuario con id " + idUsuario + " no encontrado"));

    // Eliminar la persona asociada, si existe
    Persona persona = personaRepository.findByUsuario(usuario);
    if (persona != null) {
        personaRepository.delete(persona);
    }

    // Eliminar el usuario
    usuarioRepository.delete(usuario);
}
}