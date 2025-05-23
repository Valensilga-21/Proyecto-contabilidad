package com.sena.lcdsena.service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.sena.lcdsena.model.viaje;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class viajeTokenService {

    private final jwtService jwtService;

    public String generarTokenViaje(viaje viaje) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("id_viaje", viaje.getId_viaje());
        claims.put("fecha_inicio", viaje.getFecha_inicio() != null 
            ? viaje.getFecha_inicio().format(DateTimeFormatter.ISO_LOCAL_DATE) 
            : "N/A");
        claims.put("fecha_fin", viaje.getFecha_fin() != null 
            ? viaje.getFecha_fin().format(DateTimeFormatter.ISO_LOCAL_DATE) 
            : "N/A");
        claims.put("ruta", viaje.getRuta() != null ? viaje.getRuta() : "N/A");
        claims.put("estado_viaje", viaje.getEstado_viaje() != null ? viaje.getEstado_viaje().toString() : "N/A");

        return jwtService.createToken(claims, viaje.getId_viaje());
    }
}
