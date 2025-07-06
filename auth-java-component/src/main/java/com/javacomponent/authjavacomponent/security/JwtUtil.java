package com.javacomponent.authjavacomponent.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class JwtUtil {

    //private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
    //private final long EXPIRATION_TIME = 86400000; // 1 día

    private PrivateKey loadPrivateKey(String filename) throws Exception {
    String key = new String(Files.readAllBytes(Paths.get(filename)))
        .replaceAll("-----BEGIN PRIVATE KEY-----", "")
        .replaceAll("-----END PRIVATE KEY-----", "")
        .replaceAll("\\s", "");
    byte[] keyBytes = Base64.getDecoder().decode(key);
    PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
    KeyFactory kf = KeyFactory.getInstance("RSA");
    return kf.generatePrivate(spec);
}

    private PublicKey loadPublicKey(String filename) throws Exception {
        String key = new String(Files.readAllBytes(Paths.get(filename)))
            .replaceAll("-----BEGIN PUBLIC KEY-----", "")
            .replaceAll("-----END PUBLIC KEY-----", "")
            .replaceAll("\\s", "");
        byte[] keyBytes = Base64.getDecoder().decode(key);
        X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePublic(spec);
    }

    public String generateToken(Long userId, String username, Long roleId, String role_name, Long conjuntoId, String hashConjunto) {
    try {
        PrivateKey privateKey = loadPrivateKey("/run/secrets/JWT_private.key");
        return Jwts.builder()
            .claim("userId", userId)
            .claim("username", username)
            .claim("roleId", roleId)
            .claim("role_name", role_name)
            .claim("conjuntoId", conjuntoId)
            .claim("hashConjunto", hashConjunto)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(privateKey, SignatureAlgorithm.RS256)
            .compact();
    } catch (Exception e) {
        throw new RuntimeException("Error al firmar el token JWT", e);
    }
}

    public Long getUserIdFromToken(String token) {
        try {
            PublicKey publicKey = loadPublicKey("/run/secrets/JWT_public.key.pub");
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            Object userIdObj = claims.get("userId");
            if (userIdObj instanceof Integer) {
                return ((Integer) userIdObj).longValue();
            } else if (userIdObj instanceof Long) {
                return (Long) userIdObj;
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Error al extraer userId del token JWT", e);
        }
    }

/*     public String extractUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    } */
}