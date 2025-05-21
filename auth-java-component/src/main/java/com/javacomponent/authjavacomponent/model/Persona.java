package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPersona;

    private String nombre;
    private String correo;
    private String celular;

    @OneToOne
    @JoinColumn(name = "usuario_id_usuario")
    private Usuario usuario;    
}