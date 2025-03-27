package com.sena.lcdsena.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_legalizacion", nullable = false, length = 36)
    private String id_legalizacion;

    @Column(name = "moti_devolucion", nullable = false, length = 5000)
    private String moti_devolucion;

    @Column(name = "fecha_soli", nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fecha_soli;

    @PrePersist
    protected void onCreate() {
        this.fecha_soli = LocalDate.now();
    }

    @Enumerated(EnumType.STRING)
    private estadoLegalizacion estado_lega;

    @Column(name = "pdf", nullable = true, columnDefinition = "MEDIUMBLOB")
    private String pdf;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_viaje")
    private viaje viaje;

}
