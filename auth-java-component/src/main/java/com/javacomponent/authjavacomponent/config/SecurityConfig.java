package com.javacomponent.authjavacomponent.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desactiva CSRF por ahora (útil para APIs)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/saludo").permitAll() // Endpoint público
                .anyRequest().authenticated()           // Resto requiere autenticación
            )
            .httpBasic(Customizer.withDefaults()); // Modo básico para pruebas (luego se cambia a JWT)

        return http.build();
    }
}
