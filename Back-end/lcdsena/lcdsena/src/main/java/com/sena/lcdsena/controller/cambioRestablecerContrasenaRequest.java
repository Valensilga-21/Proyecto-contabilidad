package com.sena.lcdsena.controller;

public class cambioRestablecerContrasenaRequest {
    private String nuevaContrasena;
	private String confirmarContrasena;
	   
	   
	public cambioRestablecerContrasenaRequest() {
		super();
	}

	public cambioRestablecerContrasenaRequest(String nuevaContrasena, String confirmarContrasena) {
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
