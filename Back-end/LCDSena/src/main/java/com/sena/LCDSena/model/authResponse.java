package com.sena.LCDSena.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class authResponse {
    private String mensaje;
    private String Token;
    private boolean emailExists;
    private String nombreCompleto;
    private rol rol;
}
