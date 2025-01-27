package com.sena.LCDSena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;

@Entity(name="usuario")
public class usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario", nullable = false, length = 36)
    private String id_usuario;

    @Column(name = "documento_usuario", nullable = false, length = 11)
    private String documento_usuario;

    @Column(name = "nombre_usuario", nullable = false, length = 150)
    private String nombre_usuario;

    @Column(name = "correo_usuario", nullable = false, length = 255)
    private String correo_usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "centro", nullable = false, length = 12)
    private centro centro;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo", nullable = false, length = 12)
    private cargo cargo;

    @Column(name = "contrasena", nullable = false, length = 60)
    private String contrasena;

    @Column(name = "confirm_contrasena", nullable = false, length = 60)
    private String confirm_contrasena;

    @Column(name = "estado_usuario", nullable = false, length = 36)
    private String estado_usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 12)
    private rol rol;

    public usuario() {
    }

    public usuario(String id_usuario, String documento_usuario, String nombre_usuario, String correo_usuario,
            com.sena.LCDSena.model.centro centro, com.sena.LCDSena.model.cargo cargo, String contrasena,
            String confirm_contrasena, String estado_usuario, com.sena.LCDSena.model.rol rol) {
        this.id_usuario = id_usuario;
        this.documento_usuario = documento_usuario;
        this.nombre_usuario = nombre_usuario;
        this.correo_usuario = correo_usuario;
        this.centro = centro;
        this.cargo = cargo;
        this.contrasena = contrasena;
        this.confirm_contrasena = confirm_contrasena;
        this.estado_usuario = estado_usuario;
        this.rol = rol;
    }

    public String getId_usuario() {
        return id_usuario;
    }

    public void setId_usuario(String id_usuario) {
        this.id_usuario = id_usuario;
    }

    public String getDocumento_usuario() {
        return documento_usuario;
    }

    public void setDocumento_usuario(String documento_usuario) {
        this.documento_usuario = documento_usuario;
    }

    public String getNombre_usuario() {
        return nombre_usuario;
    }

    public void setNombre_usuario(String nombre_usuario) {
        this.nombre_usuario = nombre_usuario;
    }

    public String getCorreo_usuario() {
        return correo_usuario;
    }

    public void setCorreo_usuario(String correo_usuario) {
        this.correo_usuario = correo_usuario;
    }

    public centro getCentro() {
        return centro;
    }

    public void setCentro(centro centro) {
        this.centro = centro;
    }

    public cargo getCargo() {
        return cargo;
    }

    public void setCargo(cargo cargo) {
        this.cargo = cargo;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getConfirm_contrasena() {
        return confirm_contrasena;
    }

    public void setConfirm_contrasena(String confirm_contrasena) {
        this.confirm_contrasena = confirm_contrasena;
    }

    public String getEstado_usuario() {
        return estado_usuario;
    }

    public void setEstado_usuario(String estado_usuario) {
        this.estado_usuario = estado_usuario;
    }

    public rol getRol() {
        return rol;
    }

    public void setRol(rol rol) {
        this.rol = rol;
    }
}
