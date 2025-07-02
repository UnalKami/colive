package com.javacomponent.authjavacomponent.repository;

import com.javacomponent.authjavacomponent.model.UsuarioConjunto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioConjuntoRepository extends JpaRepository<UsuarioConjunto, Long> {
    // Puedes agregar métodos de consulta personalizados si lo necesitas
}