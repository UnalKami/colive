package com.javacomponent.authjavacomponent.repository;

import com.javacomponent.authjavacomponent.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo);
    Optional<Usuario> findByTokenVerificacion(String token);
    boolean existsByCorreo(String correo);
}
