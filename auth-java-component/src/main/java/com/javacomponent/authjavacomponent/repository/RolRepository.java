package com.javacomponent.authjavacomponent.repository;

import com.javacomponent.authjavacomponent.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findById(Long id);
    Optional<Rol> findByNombreRol(String nombreRol);
}