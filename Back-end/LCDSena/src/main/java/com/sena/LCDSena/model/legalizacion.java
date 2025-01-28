package com.sena.LCDSena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

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

    public legalizacion() {
    }

    public legalizacion(String id_legalizacion, String moti_devolucion, String fecha_soli, String estado_lega,
            String pdf, com.sena.LCDSena.model.usuario usuario, com.sena.LCDSena.model.viaje viaje) {
        this.id_legalizacion = id_legalizacion;
        this.moti_devolucion = moti_devolucion;
        this.fecha_soli = fecha_soli;
        this.estado_lega = estado_lega;
        this.pdf = pdf;
        this.usuario = usuario;
        this.viaje = viaje;
    }

    public String getId_legalizacion() {
        return id_legalizacion;
    }

    public void setId_legalizacion(String id_legalizacion) {
        this.id_legalizacion = id_legalizacion;
    }

    public String getMoti_devolucion() {
        return moti_devolucion;
    }

    public void setMoti_devolucion(String moti_devolucion) {
        this.moti_devolucion = moti_devolucion;
    }

    public String getFecha_soli() {
        return fecha_soli;
    }

    public void setFecha_soli(String fecha_soli) {
        this.fecha_soli = fecha_soli;
    }

    public String getEstado_lega() {
        return estado_lega;
    }

    public void setEstado_lega(String estado_lega) {
        this.estado_lega = estado_lega;
    }

    public String getPdf() {
        return pdf;
    }

    public void setPdf(String pdf) {
        this.pdf = pdf;
    }

    public usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(usuario usuario) {
        this.usuario = usuario;
    }

    public viaje getViaje() {
        return viaje;
    }

    public void setViaje(viaje viaje) {
        this.viaje = viaje;
    }

}
