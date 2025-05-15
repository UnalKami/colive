package com.javacomponent.authjavacomponent.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SaludoController {
    
    @GetMapping("/saludo")
    public String saludar() {
        System.out.println(">>> Se accedió al endpoint /saludo");
        return "Hola desde Spring Boot!";
    }
}