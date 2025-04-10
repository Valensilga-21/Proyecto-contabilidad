package com.sena.lcdsena.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class viajeRequest {

    private int num_comision;
    private LocalDate fecha_inicio;
    private LocalDate fecha_fin;
    private String ruta;
    private estadoViaje estado_viaje;
    private String id_usuario;
}
