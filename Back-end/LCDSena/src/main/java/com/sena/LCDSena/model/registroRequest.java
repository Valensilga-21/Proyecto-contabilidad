package com.sena.LCDSena.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class registroRequest {

    private String nombre_usuario;
    private String username;
    private String password;
    private String confirm_contrasena;
}
