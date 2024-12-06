package com.sena.LCD.model;

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
@Entity(name = "legalizacion")
public class legalizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_legalizacion;

    @Column(name = "motivo_devo", nullable = false, length = 3000)
    private String motivo_devo;

    @Column(name = "estado_lega", nullable = false, length = 3000)
    private String estado_lega;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_viaje")
    private viaje viaje;
}
