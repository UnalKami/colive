package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.ConjuntoResidencialRequestDTO;
import com.javacomponent.authjavacomponent.model.ConjuntoResidencial;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConjuntoResidencialService {  

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void crearConjunto(ConjuntoResidencialRequestDTO dto) {
        Usuario duenio = usuarioRepository.findById(dto.getIdDuenio())
            .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

        ConjuntoResidencial conjunto = new ConjuntoResidencial();
        conjunto.setHashConjuntoResidencial(dto.getHashConjuntoResidencial());
        conjunto.setDuenio(duenio);
    }
}