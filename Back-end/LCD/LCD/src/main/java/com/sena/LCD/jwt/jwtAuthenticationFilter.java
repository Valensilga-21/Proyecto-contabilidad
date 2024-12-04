package com.sena.LCD.jwt;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.sena.LCD.service.jwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class jwtAuthenticationFilter {
    private final jwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final String Token = getTokenFromRequest(request);
        final String correo_usuario;
        System.out.println("Token obtenido: " + Token);
        if (Token == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Obtener el correo electrónico desde el token
            correo_usuario = jwtService.getCorreoElectronicoFromToken(Token);
            System.out.println("Correo electrónico extraído del token: " + correo_usuario);

            if (correo_usuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Cargar detalles del usuario
                var userDetails = userDetailsService.loadUserByUsername(correo_usuario);
                System.out.println("Detalles del usuario cargados: " + userDetails.getUsername());

                // Validar el token
                if (jwtService.isTokenValid(Token, userDetails)) {
                    // Crear token de autenticación
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,
                            null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Establecer el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Autenticación exitosa para el usuario: " + correo_usuario);
                } else {
                    System.out.println("Token inválido para el usuario: " + correo_usuario);
                    UsernamePasswordAuthenticationToken authToken = null;
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            System.out.println("Error al procesar el token: " + e.getMessage());
            UsernamePasswordAuthenticationToken authToken = null;
            SecurityContextHolder.getContext().setAuthentication(authToken);
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        // Continuar con el filtro
        filterChain.doFilter(request, response);

    }

    private String getTokenFromRequest(HttpServletRequest request) {

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        // Depurar el valor de authHeader
        System.out.println("Authorization Header: " + authHeader);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
