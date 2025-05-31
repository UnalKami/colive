package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rol {

    public static final Long ADMIN_CR = (long) 1;
    public static final Long PROPIEDAD_CR = (long) 2;
    public static final Long RECIDENTE_CR = (long) 3;
    public static final Long SEGURIDAD_CR = (long) 4;
    public static final Long MANTENIMIENTO_CR = (long) 5;
    public static final Long ACEO_CR = (long) 6;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRol;

    private String nombreRol;

    @OneToMany(mappedBy = "rol")
    private List<Usuario> usuarios;
}