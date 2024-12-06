package com.sena.LCD.controller;

public class RecuperarContrasenaRequest {

    private String correoElectronico;

    public RecuperarContrasenaRequest() {
        super();
    }

    public RecuperarContrasenaRequest(String correoElectronico) {
        super();
        this.correoElectronico = correoElectronico;
    }

    public String getCorreo_usuario() {
        return correoElectronico;
    }

    public void setCorreo_usuario(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

}
