package com.sena.LCD.controller;

public class CambioRecuperaContrasenaRequest {
    private String nuevaContrasena;
    private String confirmarContrasena;

    public CambioRecuperaContrasenaRequest() {
        super();
    }

    public CambioRecuperaContrasenaRequest(String nuevaContrasena, String confirmarContrasena) {
        super();
        this.nuevaContrasena = nuevaContrasena;
        this.confirmarContrasena = confirmarContrasena;
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
