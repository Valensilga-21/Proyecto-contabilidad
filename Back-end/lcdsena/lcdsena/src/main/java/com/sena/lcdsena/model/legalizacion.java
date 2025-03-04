package com.sena.lcdsena.model;

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
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_legalizacion", nullable = false, length = 36)
    private String id_legalizacion;

    @Column(name = "moti_devolucion", nullable = false, length = 5000)
    private String moti_devolucion;

    @Column(name = "fecha_soli", nullable = false, length = 12)
    private String fecha_soli;

    @Column(name = "estado_lega", nullable = false, length = 20)
    private String estado_lega;

    @Column(name = "pdf", nullable = true, columnDefinition = "MEDIUMBLOB")
    private String pdf;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuario usuario;

    @OneToOne
    @JoinColumn(name = "id_viaje")
    private viaje viaje;

}
