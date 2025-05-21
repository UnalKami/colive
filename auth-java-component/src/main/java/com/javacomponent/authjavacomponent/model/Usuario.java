package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;

    private String username;
    private String password;

    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    @OneToOne(mappedBy = "usuario")
    private Persona persona;
}

/*
 package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String correo;

    private String contraseña;

    private String rol;

    @Column(name = "verificado")
    private boolean verificado = false;

    @Column(name = "token_verificacion")
    private String tokenVerificacion;
}

 */