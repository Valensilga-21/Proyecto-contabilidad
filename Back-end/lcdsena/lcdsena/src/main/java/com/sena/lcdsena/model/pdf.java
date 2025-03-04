package com.sena.lcdsena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "pdf")
public class pdf {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_pdf", nullable = false, length = 36)
    private String id_pdf;

    @ManyToOne
    @JoinColumn(name ="idLegalizacion")
    private legalizacion legalizacion;

    @Column(name = "pdf", nullable = false, length = 200)
    private String pdf;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuario usuario;
}
