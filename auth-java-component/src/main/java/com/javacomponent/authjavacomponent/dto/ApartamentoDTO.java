package com.javacomponent.authjavacomponent.dto;

import lombok.Data;

@Data
public class ApartamentoDTO {
    private String hashApartamento;
    private String nombreApartamento;

    public ApartamentoDTO(String hashApartamento, String nombreApartamento) {
        this.hashApartamento = hashApartamento;
        this.nombreApartamento = nombreApartamento;
    }
    public ApartamentoDTO() {
    }
    public String getHashApartamento() {
        return hashApartamento;
    }
    public void setHashApartamento(String hashApartamento) {
        this.hashApartamento = hashApartamento;
    }
    public String getNombreApartamento() {
        return nombreApartamento;
    }
    public void setNombreApartamento(String nombreApartamento) {
        this.nombreApartamento = nombreApartamento;
    }

}