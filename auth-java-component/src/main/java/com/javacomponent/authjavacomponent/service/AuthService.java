package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.security.JwtUtil;
import com.javacomponent.authjavacomponent.model.UsuarioConjunto;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> login(LoginRequestDTO loginDTO, HttpServletResponse response) {
        Usuario usuario = usuarioRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        // Obtener datos para el token
        Long idUsuario = usuario.getIdUsuario();
        String username = usuario.getUsername();
        Long idRol = usuario.getRol().getIdRol();
        UsuarioConjunto usuarioConjunto = usuario.getUsuarioConjunto();
        Long conjuntoId = usuarioConjunto != null ? usuarioConjunto.getConjuntoResidencial().getIdConjuntoResidencial() : null;
        String hashConjunto = usuarioConjunto != null ? usuarioConjunto.getConjuntoResidencial().getHashConjuntoResidencial() : null;

        // Obtener el nombre del rol
        String roleName = usuario.getRol().getNombreRol();

        String token = jwtUtil.generateToken(
            idUsuario,
            username,
            idRol,
            roleName,
            conjuntoId,
            hashConjunto
        );

        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true);
        //cookie.setSecure(true); // Solo en HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(7200); // 2 horas en segundos        
        //cookie.setSameSite("Strict"); // Requiere Servlet 4.0+ o set manualmente

        response.addCookie(cookie);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("userId", idUsuario);
        responseBody.put("username", username);
        responseBody.put("roleId", idRol);
        responseBody.put("roleName", roleName);
        responseBody.put("conjuntoId", conjuntoId);
        responseBody.put("hashConjunto", hashConjunto);

        return responseBody;
    }

}
