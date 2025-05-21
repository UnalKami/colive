package com.javacomponent.authjavacomponent.dto;

import lombok.Data;

@Data
public class ConjuntoResidencialRequestDTO {
    private String hashConjuntoResidencial;
    private Long idDuenio;

    public ConjuntoResidencialRequestDTO(String hashConjuntoResidencial, Long idDuenio) {
        this.hashConjuntoResidencial = hashConjuntoResidencial;
        this.idDuenio = idDuenio;
    }
    public ConjuntoResidencialRequestDTO() {
    }
    public String getHashConjuntoResidencial() {
        return hashConjuntoResidencial;
    }
    public void setHashConjuntoResidencial(String hashConjuntoResidencial) {
        this.hashConjuntoResidencial = hashConjuntoResidencial;
    }
    public Long getIdDuenio() {
        return idDuenio;
    }
    public void setIdDuenio(Long idDuenio) {
        this.idDuenio = idDuenio;
    }    
}