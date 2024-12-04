package com.sena.LCD.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class loginRequest {
    private String correo_usuario;
    private String contra;
    private String token;
}
