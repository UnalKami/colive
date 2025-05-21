package com.javacomponent.authjavacomponent.dto;

import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String username;
    private String password;
    private String nombre;
    private String correo;
    private String celular;

    public RegistroRequestDTO(String username, String password, String nombre, String correo, String celular) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.correo = correo;
        this.celular = celular;
    }
    public RegistroRequestDTO() {
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
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
    public String getCelular() {
        return celular;
    }
    public void setCelular(String celular) {
        this.celular = celular;
    }
    
}