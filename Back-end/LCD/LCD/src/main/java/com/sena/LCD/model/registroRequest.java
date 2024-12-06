package com.sena.LCD.model;

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
    private String num_documento;
    private String correo_usuario;
    private String centro;
    private String cargo;
    private String contra;
    private String confirm_contra;
}
