package com.sena.lcdsena.controller;

public class cambioContrasenaRequest {

    private String actualContrasena;
    private String nuevaContrasena;
    private String confirmarContrasena;

    // Getters y Setters
    public String getActualContrasena() {
        return actualContrasena;
    }

    public void setActualContrasena(String actualContrasena) {
        this.actualContrasena = actualContrasena;
    }

    public String getNuevaContrasena() {
        return nuevaContrasena;
    }

    public void setNuevaContrasena(String nuevaContrasena) {
        this.nuevaContrasena = nuevaContrasena;
    }

    public String getConfirmarContrasena() {
        return confirmarContrasena;
    }

    public void setConfirmarContrasena(String confirmarContrasena) {
        this.confirmarContrasena = confirmarContrasena;
    }
}
