package com.javacomponent.authjavacomponent.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Residente {  

    @Id
    @ManyToOne    
    @JoinColumn(name = "usuario_id_usuario")
    private Usuario usuario;

    @ManyToOne    
    @JoinColumn(name = "apartamento_idapartamento")
    private Apartamento apartamento;
}

