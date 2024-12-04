package com.sena.LCD.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class jwtService {

    private static final String secret_key = "DIxVQbQ+xsRwn8Mzm8SgF6ZjannqL79G3F451Uv5V3w=";

    public String getToken(UserDetails userData) {
        return getToken(new HashMap<>(), userData);
    }

    private String getToken(HashMap<String, Object> extraClaims, UserDetails userData) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userData.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();

    }

    // Método privado que genera el token
    private String createToken(HashMap<String, Object> extraClaims, String subject) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // Agregar los claims
                .setSubject(subject) // El subject será el correo
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Expira en 1 hora
                .signWith(getKey(), SignatureAlgorithm.HS256) // Firmamos con el algoritmo HS256
                .compact();
    }

    private Key getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret_key);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getCorreoElectronicoFromToken(String Token) {
        return getClaims(Token, Claims::getSubject);
    }

    public boolean isTokenValid(String Token, UserDetails userDetails) {
        final String correoElectronico = getCorreoElectronicoFromToken(Token);
        return (correoElectronico.equals(userDetails.getUsername()) && !isTokenExpired(Token));
    }

    private boolean isTokenExpired(String Token) {
        return getExpiration(Token).before(new Date());
    }

    private Date getExpiration(String Token) {
        return getClaims(Token, Claims::getExpiration);
    }

    public Claims getAllClaims(String Token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(Token)
                .getBody();
    }

    public <T> T getClaims(String Token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaims(Token);
        return claimsResolver.apply(claims);
    }

    public String getNumDocFromToken(String token) {
        return (String) getAllClaims(token).get("numDoc");
    }

    public String getNombreApellidoFromToken(String token) {
        return (String) getAllClaims(token).get("nombreApellido");
    }

    // Método para extraer el username (correo electrónico) del token JWT
    public String extractUsername(String token) {
        // Extrae el claim del subject (nombre de usuario o correo)
        return getClaims(token, Claims::getSubject);
    }

    // Método para extraer la fecha de expiración del token JWT
    public Date extractExpiration(String token) {
        // Extrae el claim de expiración
        return getClaims(token, Claims::getExpiration);
    }

    // SOL VAMOS A PERMITIRQUE EL ADMIN PUEDA MODIFICAR

    // public boolean isAdmin(String token) {
    // String role = getRoleFromToken(token);
    // return role != null && role.contains("Administrador"); // Verificar si el rol
    // es Administrador
    // }
}
