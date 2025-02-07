package com.sena.LCDSena.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCDSena.model.authResponse;
import com.sena.LCDSena.model.loginRequest;
import com.sena.LCDSena.model.registroRequest;
import com.sena.LCDSena.service.authService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import java.util.Optional;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/LCDSena/publico/usuario/")
public class usuarioPublicoController {

    private final authService authService;

    @PostMapping("login/")
    public ResponseEntity<authResponse> login(@RequestBody loginRequest request) {
        try {
            // Autentica al usuario y genera el token
            authResponse authResponse = authService.login(request);
            authResponse.setMensaje("Acceso Permitido");

            return new ResponseEntity<>(authResponse, HttpStatus.OK);
        } catch (AuthenticationException e) {
            // Maneja errores de autenticación
            authResponse response = new authResponse();
            response.setMensaje("ACCESO DENEGADO. POR FAVOR, REGÍSTRESE");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("register/")
    public ResponseEntity<String> register(@RequestBody String request) {
        return new ResponseEntity<String> ("End point privado", HttpStatus.OK);
    }
    
}
