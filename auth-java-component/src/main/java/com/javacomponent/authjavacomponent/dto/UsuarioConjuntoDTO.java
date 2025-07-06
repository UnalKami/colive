package com.javacomponent.authjavacomponent.dto;

import lombok.Data;

@Data
public class UsuarioConjuntoDTO {
    private Long usuarioId;
    private Long conjuntoResidencialId;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getConjuntoResidencialId() {
        return conjuntoResidencialId;
    }

    public void setConjuntoResidencialId(Long conjuntoResidencialId) {
        this.conjuntoResidencialId = conjuntoResidencialId;
    }
}