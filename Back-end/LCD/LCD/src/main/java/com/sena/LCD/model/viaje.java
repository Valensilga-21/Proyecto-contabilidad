package com.sena.LCD.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "viaje")
public class viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_viaje", nullable = false, length = 36)
    private String id_viaje;

    @Column(name = "num_comision", nullable = false, unique = true, length = 50)
    private String num_comision;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fecha_inicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fecha_fin;

    @Column(name = "ruta", nullable = false, length = 255)
    private String ruta;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private usuario usuario;

    @OneToOne(mappedBy = "viaje")
    private legalizacion legalizacion;
}
