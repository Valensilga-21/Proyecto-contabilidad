package com.sena.LCD.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCD.model.authResponse;
import com.sena.LCD.model.loginRequest;
import com.sena.LCD.model.registroRequest;
import com.sena.LCD.service.authService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Optional;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/publico/usuario/")
public class usuarioPublicoController {

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

    @PostMapping("registro/")
    public ResponseEntity<authResponse> registro(@RequestBody registroRequest request) {
        var valido = true;
        authResponse response = new authResponse();
        if (authService.findBycorreoElectronico(request.getCorreo_usuario()).isPresent()) {
            valido = false;
            response.setEmailExists(true);
            response.setMensaje("El correo electronico ya existe");
            return new ResponseEntity<authResponse>(response, HttpStatus.BAD_REQUEST);
        }

        if (valido) {
            response = authService.registro(request);
            response.setMensaje("Se registró correctamente");
            // para envíar el correo electronico

            // emailService.enviarCorreoBienvenida(request.getCorreoElectronico(),

            // request.getNombreCompleto());
            return new ResponseEntity<authResponse>(response, HttpStatus.OK);
        }
        return new ResponseEntity<authResponse>(response, HttpStatus.OK);
    }

    @PostMapping("verificarToken/")
    public ResponseEntity<authResponse> verificarToken(@RequestBody String Token) {
        Optional<authResponse> authResult = authService.verificarToken(Token);
        authResponse response = new authResponse();

        if (authResult.isPresent()) {
            // authResponse response = new authResponse();
            response.setMensaje("Token válido. Usuario registrado.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            // authResponse response = new authResponse();
            response.setMensaje("Token no válido. Por favor, regístrese.");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

}
