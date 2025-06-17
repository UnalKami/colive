package com.javacomponent.authjavacomponent.service;

import com.javacomponent.authjavacomponent.dto.LoginRequestDTO;
import com.javacomponent.authjavacomponent.model.Usuario;
import com.javacomponent.authjavacomponent.repository.UsuarioRepository;
import com.javacomponent.authjavacomponent.security.JwtUtil;

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

        String token = jwtUtil.generateToken(usuario.getUsername(), usuario.getRol().getIdRol());

        Cookie cookie = new Cookie("authToken", token);
        cookie.setHttpOnly(true);
        //cookie.setSecure(true); // Solo en HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(10 * 60); // 10 minutos
        //cookie.setSameSite("Strict"); // Requiere Servlet 4.0+ o set manualmente

        response.addCookie(cookie);

        Map<String, Object> userData = new HashMap<>();
        userData.put("USUARIO_ID_Usuario", usuario.getIdUsuario());

        Map<String, Object> responseBody = new HashMap<>();
        //responseBody.put("token", token);
        responseBody.put("rol", usuario.getRol().getIdRol());
        responseBody.put("user", Collections.singletonList(userData));

        Map<String, Object> finalResponse = new HashMap<>();
        finalResponse.put("body", responseBody);

        return finalResponse;
    }

}
