package com.javacomponent.authjavacomponent.dto;

public class LoginRequestDTO {

    private String username;
    private String password;

    // Constructor vacío (obligatorio para Spring)
    public LoginRequestDTO() {}

    // Constructor completo (opcional)
    public LoginRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters y Setters
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
}
