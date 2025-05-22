package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.ApartamentoBatchRequestDTO;
import com.javacomponent.authjavacomponent.model.Apartamento;
import com.javacomponent.authjavacomponent.model.ConjuntoResidencial;
import com.javacomponent.authjavacomponent.repository.ApartamentoRepository;
import com.javacomponent.authjavacomponent.repository.ConjuntoResidencialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApartamentoService {

    @Autowired
    private ConjuntoResidencialRepository conjuntoRepository;

    @Autowired
    private ApartamentoRepository apartamentoRepository;

    public void crearApartamentos(ApartamentoBatchRequestDTO dto) {
        ConjuntoResidencial conjunto = conjuntoRepository.findById(dto.getIdConjuntoResidencial())
                .orElseThrow(() -> new RuntimeException("Conjunto no encontrado"));

        List<Apartamento> apartamentos = dto.getApartamentos().stream().map(aptoDto -> {
            Apartamento apto = new Apartamento();
            apto.setHashApartamento(aptoDto.getHashApartamento());
            apto.setNombreApartamento(aptoDto.getNombreApartamento());
            apto.setConjuntoResidencial(conjunto);
            return apto;
        }).collect(Collectors.toList());

        apartamentoRepository.saveAll(apartamentos);
    }
}