package com.javacomponent.authjavacomponent.dto;

import java.util.List;

import lombok.Data;

@Data
public class ApartamentoBatchRequestDTO {
    private Long idConjuntoResidencial;
    private List<ApartamentoDTO> apartamentos;
    public ApartamentoBatchRequestDTO(Long idConjuntoResidencial, List<ApartamentoDTO> apartamentos) {
        this.idConjuntoResidencial = idConjuntoResidencial;
        this.apartamentos = apartamentos;
    }
    public ApartamentoBatchRequestDTO() {
    }
    public Long getIdConjuntoResidencial() {
        return idConjuntoResidencial;
    }
    public void setIdConjuntoResidencial(Long idConjuntoResidencial) {
        this.idConjuntoResidencial = idConjuntoResidencial;
    }
    public List<ApartamentoDTO> getApartamentos() {
        return apartamentos;
    }
    public void setApartamentos(List<ApartamentoDTO> apartamentos) {
        this.apartamentos = apartamentos;
    }
    
}