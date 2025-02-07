package com.sena.LCDSena.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/v1/LCDSena/publico/usuario/")
public class usuarioPublicoController {

    @PostMapping("login/")
    public ResponseEntity<String> login(@RequestBody String request) {
        return new ResponseEntity<String> ("End point publico", HttpStatus.OK);
    }
    @PostMapping("register/")
    public ResponseEntity<String> register(@RequestBody String request) {
        return new ResponseEntity<String> ("End point privado", HttpStatus.OK);
    }
    
}
