package com.javacomponent.authjavacomponent.intializer;

import com.javacomponent.authjavacomponent.model.Rol;
import com.javacomponent.authjavacomponent.repository.RolRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RolRepository rolRepository;

    @Override
    public void run(String... args) {
        List<String> roles = List.of(
            "ADMIN_CR",
            "PROPIEDAD_CR",
            "RESIDENTE_CR",
            "ADMINISTRATIVO_CR",
            "SEGURIDAD_CR",
            "MANTENIMIENTO_CR",
            "ASEO_CR"
        );

        for (String nombreRol : roles) {
            if (!rolRepository.existsByNombreRol(nombreRol)) {
                rolRepository.save(new Rol(nombreRol));
            }
        }
    }
}