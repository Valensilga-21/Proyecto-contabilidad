package com.sena.lcdsena.controller;

public class recuperarContrasenaRequest {

    private String username;

   public recuperarContrasenaRequest() {
       super();
   }

   public recuperarContrasenaRequest(String username) {
       super();
       this.username = username;
   }

   public String getUsername() {
       return username;
   }

   public void setUsername(String username) {
       this.username = username;
   }
}
