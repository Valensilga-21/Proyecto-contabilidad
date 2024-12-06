package com.sena.LCD.controller;

public class CambioContrasenaRequest {
    private String antiguaContrasena;
    private String nuevaContrasena;
    private String confirmarContrasena;

    // Getters y Setters
    public String getAntiguaContrasena() {
        return antiguaContrasena;
    }

    public void setAntiguaContrasena(String antiguaContrasena) {
        this.antiguaContrasena = antiguaContrasena;
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
