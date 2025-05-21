package com.javacomponent.authjavacomponent.repository;

import com.javacomponent.authjavacomponent.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Persona, Long> {
}