package com.sena.lcdsena.service;

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

    private static final String secret_key = "VlMseUb+eqvcuu/mB4E3vGeWMFlh5n4zowv0+ZlNa4k=";

    public String getToken(UserDetails userData) {
        return getToken(new HashMap<>(), userData);
    }

    private String getToken(HashMap<String, Object> extraClaims, UserDetails userData) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userData.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60*24))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();

    }
    
    public String createToken(HashMap<String, Object> extraClaims, String subject) {
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

    public String getUsernameFromToken(String Token) {
        return getClaims(Token, Claims::getSubject);
    }

    public boolean isTokenValid(String Token, UserDetails userDetails) {
        final String username = getUsernameFromToken(Token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(Token));
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

    public String extractUsername(String token) {
        return getClaims(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return getClaims(token, Claims::getExpiration);
    }
}
