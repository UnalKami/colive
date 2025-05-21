package com.javacomponent.authjavacomponent.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConjuntoResidencial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConjuntoResidencial;
    
    private String hashConjuntoResidencial;

    @ManyToOne
    @JoinColumn(name = "duenio_id_usuario")
    private Usuario duenio;

    @OneToMany(mappedBy = "conjuntoResidencial")
    private List<Apartamento> apartamentos;

    public Long getIdConjuntoResidencial() {
        return idConjuntoResidencial;
    }

    public void setIdConjuntoResidencial(Long idConjuntoResidencial) {
        this.idConjuntoResidencial = idConjuntoResidencial;
    }

    public String getHashConjuntoResidencial() {
        return hashConjuntoResidencial;
    }

    public void setHashConjuntoResidencial(String hashConjuntoResidencial) {
        this.hashConjuntoResidencial = hashConjuntoResidencial;
    }

    public Usuario getDuenio() {
        return duenio;
    }

    public void setDuenio(Usuario duenio) {
        this.duenio = duenio;
    }

    public List<Apartamento> getApartamentos() {
        return apartamentos;
    }

    public void setApartamentos(List<Apartamento> apartamentos) {
        this.apartamentos = apartamentos;
    }

}