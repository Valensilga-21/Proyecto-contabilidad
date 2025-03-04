package com.sena.lcdsena.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.loginRequest;
import com.sena.lcdsena.model.registroRequest;
import com.sena.lcdsena.service.authService;
import com.sena.lcdsena.service.emailService;

import lombok.RequiredArgsConstructor;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/LCDSena/publico/usuario/")
public class usuarioPublicoController {

    private final authService authService;

    @Autowired
    private emailService emailService;

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
    public ResponseEntity<authResponse> registro(@RequestBody registroRequest request) {
        var valido = true;
        authResponse response = new authResponse();

        if (authService.findByUsername(request.getUsername()).isPresent()) {
            valido = false;
            response.setEmailExists(true);
            response.setMensaje("El correo electronico ya existe");
            return new ResponseEntity<authResponse>(response, HttpStatus.BAD_REQUEST);
        }

        if (valido) {

            request.setEstado_Usuario(estadoUsuario.pendiente);
            response = authService.registro(request);
            response.setMensaje("Su solicitud de registro ha sido enviada correctamente.");
            //para envíar el correo electronico
            // emailService.enviarCorreoBienvenida(request.getUsername(), request.getNombre_usuario());
            return new ResponseEntity<authResponse>(response, HttpStatus.OK);
        }
        return new ResponseEntity<authResponse>(response, HttpStatus.OK);
    }

    @PostMapping("verificarToken/")
    public ResponseEntity<authResponse> verificarToken(@RequestBody String Token) {
        Optional<authResponse> authResult = authService.verificarToken(Token);
        authResponse response = new authResponse();

        if (authResult.isPresent()) {
            response.setMensaje("Token válido. Usuario registrado.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.setMensaje("Token no válido. Por favor, regístrese.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
    
}
