package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}