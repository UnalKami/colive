package com.javacomponent.authjavacomponent.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class UsuarioDTO {
    private String nombre;
    private String correo;
    private Integer telefono;
    private String username;
    private Long rol;
    
    public UsuarioDTO(String nombre, String correo, Integer telefono, String username, Long rol) {
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.username = username;
        this.rol = rol;
    }
    public UsuarioDTO() {
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getCorreo() {
        return correo;
    }
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    public Integer getTelefono() {
        return telefono;
    }
    public void setTelefono(Integer telefono) {
        this.telefono = telefono;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public Long getRol() {
        return rol;
    }
    public void setRol(Long rol) {
        this.rol = rol;
    }
    
}
