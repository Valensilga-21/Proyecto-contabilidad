package com.sena.lcdsena.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class registroRequest {

    private String documento_usuario;
    private String nombre_usuario;
    private String username;
    private centro centro;
    private cargo cargo;
    private String password;
    private String confirm_contrasena;
    private estadoUsuario estado_usuario;
    private role role;
}
