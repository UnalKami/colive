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
public class Apartamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idApartamento;

    private String hashApartamento;

    private String nombreApartamento;

    @ManyToOne
    @JoinColumn(name = "duenio_id_usuario")
    private Usuario duenio;

    @ManyToOne
    @JoinColumn(name = "id_conjunto_residencial")
    private ConjuntoResidencial conjuntoResidencial;

    @OneToMany(mappedBy = "apartamento")
    private List<Residente> residentes;

    public Long getIdApartamento() {
        return idApartamento;
    }

    public void setIdApartamento(Long idApartamento) {
        this.idApartamento = idApartamento;
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

    public Usuario getDuenio() {
        return duenio;
    }

    public void setDuenio(Usuario duenio) {
        this.duenio = duenio;
    }

    public ConjuntoResidencial getConjuntoResidencial() {
        return conjuntoResidencial;
    }

    public void setConjuntoResidencial(ConjuntoResidencial conjuntoResidencial) {
        this.conjuntoResidencial = conjuntoResidencial;
    }

    public List<Residente> getResidentes() {
        return residentes;
    }

    public void setResidentes(List<Residente> residentes) {
        this.residentes = residentes;
    }
}