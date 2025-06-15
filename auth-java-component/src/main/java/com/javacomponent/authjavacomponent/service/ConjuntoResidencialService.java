package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.ConjuntoResidencialRequestDTO;
import com.javacomponent.authjavacomponent.model.ConjuntoResidencial;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.repository.ConjuntoResidencialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConjuntoResidencialService {  

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConjuntoResidencialRepository conjuntoResidencialRepository;

    public void crearConjunto(ConjuntoResidencialRequestDTO dto) {
        System.out.println("Id Dueño: " + dto.getIdDuenio());
        System.out.println("Hash Conjunto Residencial: " + dto.getHashConjuntoResidencial());
        Usuario duenio = usuarioRepository.findById(dto.getIdDuenio())
            .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

        ConjuntoResidencial conjunto = new ConjuntoResidencial();
        conjunto.setHashConjuntoResidencial(dto.getHashConjuntoResidencial());
        conjunto.setDuenio(duenio);

        conjuntoResidencialRepository.save(conjunto);
        System.out.println("Conjunto Residencial creado: " + conjunto.getHashConjuntoResidencial());

    }
}