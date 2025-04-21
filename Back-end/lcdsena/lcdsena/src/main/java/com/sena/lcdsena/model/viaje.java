package com.sena.lcdsena.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity(name = "viaje")
public class viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_viaje", nullable = false, length = 36)
    private String id_viaje;
 
    @Column(name = "num_comision", nullable = false, length = 6)
    private int num_comision;
    
    @Column(name = "fecha_inicio", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_inicio;

    @Column(name = "fecha_fin", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_fin;
 
    @Column(name = "ruta", nullable = false, length = 100)
    private String ruta;

    @Enumerated(EnumType.STRING)
    private estadoViaje estado_viaje;

    private boolean notificadoLegalizacion = false;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private usuario usuario;

    @OneToOne(mappedBy = "viaje", fetch = FetchType.EAGER)
    @JsonInclude(JsonInclude.Include.NON_NULL) // Para evitar mostrar `null`
    private legalizacion legalizacion;

}
