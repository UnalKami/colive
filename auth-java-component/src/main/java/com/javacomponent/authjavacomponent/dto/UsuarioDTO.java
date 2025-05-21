package com.javacomponent.authjavacomponent.dto;

public class UsuarioDTO {
    private String correo;
    private String rol; // Ejemplo: "PROPIETARIO", "RESIDENTE"

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
