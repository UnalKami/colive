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

    public Long crearConjunto(ConjuntoResidencialRequestDTO dto) {
        System.out.println("Id Dueño: " + dto.getIdDuenio());
        System.out.println("Hash Conjunto Residencial: " + dto.getHashConjuntoResidencial());
        Usuario duenio = usuarioRepository.findById(dto.getIdDuenio())
            .orElseThrow(() -> new RuntimeException("Dueño no encontrado"));

        ConjuntoResidencial conjunto = new ConjuntoResidencial();
        conjunto.setHashConjuntoResidencial(dto.getHashConjuntoResidencial());
        conjunto.setDuenio(duenio);

        conjuntoResidencialRepository.save(conjunto);
        System.out.println("Conjunto Residencial creado: " + conjunto.getHashConjuntoResidencial());

        return conjunto.getIdConjuntoResidencial(); // Retorna el ID generado
    }

    public void eliminarConjuntoPorId(Long idConjuntoResidencial) {
        if (!conjuntoResidencialRepository.existsById(idConjuntoResidencial)) {
            throw new RuntimeException("Conjunto residencial no encontrado con id: " + idConjuntoResidencial);
        }
        conjuntoResidencialRepository.deleteById(idConjuntoResidencial);
    }

}