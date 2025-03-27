package com.sena.lcdsena.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.sena.lcdsena.model.legalizacion;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class legalizacionTokenService {

    private final jwtService jwtService;

    public String generarTokenLegalizacion(legalizacion legalizacion) {
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("id_legalizacion", legalizacion.getId_legalizacion());
        claims.put("fecha_soli", legalizacion.getFecha_soli());
        claims.put("moti_devolucion", legalizacion.getMoti_devolucion());
        claims.put("pdf", legalizacion.getPdf());
        claims.put("estado_lega", legalizacion.getEstado_lega() != null ? legalizacion.getEstado_lega().toString() : "N/A");

        return jwtService.createToken(claims, legalizacion.getId_legalizacion());
    }
}
