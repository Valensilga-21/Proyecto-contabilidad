package com.sena.LCDSena.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

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

    public pdf() {
    }

    public pdf(String id_pdf, com.sena.LCDSena.model.legalizacion legalizacion, String pdf,
            com.sena.LCDSena.model.usuario usuario) {
        this.id_pdf = id_pdf;
        this.legalizacion = legalizacion;
        this.pdf = pdf;
        this.usuario = usuario;
    }

    public String getId_pdf() {
        return id_pdf;
    }

    public void setId_pdf(String id_pdf) {
        this.id_pdf = id_pdf;
    }

    public legalizacion getLegalizacion() {
        return legalizacion;
    }

    public void setLegalizacion(legalizacion legalizacion) {
        this.legalizacion = legalizacion;
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

    
}
