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
public class legalizacionRequest {

    private String moti_devolucion;
    private LocalDate fecha_soli;
    private estadoLegalizacion estado_lega;
    private String pdf;
    private String id_usuario;
    private String id_viaje;
}
