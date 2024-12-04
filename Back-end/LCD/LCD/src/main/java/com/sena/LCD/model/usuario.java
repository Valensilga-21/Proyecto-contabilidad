package com.sena.LCD.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "usuario")
public class usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario", nullable = false, length = 36)
    private String id_usuario;

    @Column(name = "nombre_usuario", nullable = false, length = 100)
    private String nombre_usuario;

    @Column(name = "num_documento", nullable = false, length = 11)
    private String num_documento;

    @Column(name = "correo_usuario", nullable = false, length = 100)
    private String correo_usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "centro", nullable = false, length = 12)
    private centro centro;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo", nullable = false, length = 12)
    private cargo cargo;

    @Column(name = "contra", nullable = false, length = 60)
    private String contra;

    @Column(name = "confirm_contra", nullable = false, length = 60)
    private String confirm_contra;

    @Enumerated(EnumType.STRING)
    private role role;

}
