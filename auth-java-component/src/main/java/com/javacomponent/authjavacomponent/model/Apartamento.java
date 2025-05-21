package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Apartamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idApartamento;

    private String hashApartamento;

    @ManyToOne
    @JoinColumn(name = "duenio_id_usuario")
    private Usuario duenio;

    @ManyToOne
    @JoinColumn(name = "id_conjunto_residencial")
    private ConjuntoResidencial conjuntoResidencial;

    @OneToMany(mappedBy = "apartamento")
    private List<Residente> residentes;

    /*@OneToMany(mappedBy = "apartamento")
    private List<ApartamentoHasRecursoAsignable> recursosAsignables;*/
}