package com.sena.LCDSena.model;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity(name = "viaje")
public class viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_viaje", nullable = false, length = 36)
    private String id_viaje;
 
    @Column(name = "num_comision", nullable = false, length = 6)
    private String num_comision;
 
    @Column(name = "fecha_inicio", nullable = false, length = 36)
    private Date fecha_inicio;
 
    @Column(name = "fecha_fin", nullable = false, length = 36)
    private Date fecha_fin;
 
    @Column(name = "ruta", nullable = false, length = 100)
    private String ruta;
 
    @Column(name = "estado_viaje", nullable = false, length = 36)
    private String estado_viaje;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private usuario usuario;

    public viaje() {
    }

    public viaje(String id_viaje, String num_comision, Date fecha_inicio, Date fecha_fin, String ruta,
            String estado_viaje, com.sena.LCDSena.model.usuario usuario) {
        this.id_viaje = id_viaje;
        this.num_comision = num_comision;
        this.fecha_inicio = fecha_inicio;
        this.fecha_fin = fecha_fin;
        this.ruta = ruta;
        this.estado_viaje = estado_viaje;
        this.usuario = usuario;
    }

    public String getId_viaje() {
        return id_viaje;
    }

    public void setId_viaje(String id_viaje) {
        this.id_viaje = id_viaje;
    }

    public String getNum_comision() {
        return num_comision;
    }

    public void setNum_comision(String num_comision) {
        this.num_comision = num_comision;
    }

    public Date getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(Date fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public Date getFecha_fin() {
        return fecha_fin;
    }

    public void setFecha_fin(Date fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    public String getRuta() {
        return ruta;
    }

    public void setRuta(String ruta) {
        this.ruta = ruta;
    }

    public String getEstado_viaje() {
        return estado_viaje;
    }

    public void setEstado_viaje(String estado_viaje) {
        this.estado_viaje = estado_viaje;
    }

    public usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(usuario usuario) {
        this.usuario = usuario;
    }
    
}
