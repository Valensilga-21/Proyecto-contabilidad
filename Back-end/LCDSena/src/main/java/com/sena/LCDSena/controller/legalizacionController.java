package com.sena.LCDSena.controller;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sena.LCDSena.iservice.ilegalizacionService;
import com.sena.LCDSena.model.legalizacion;
import com.sena.LCDSena.model.respuestaPdf;

@RequestMapping("/api/v1/LCDSena/legalizacion")
@RestController
public class legalizacionController {

    @Autowired
    private ilegalizacionService legalizacionService;

    @PostMapping("/")
    public ResponseEntity<Object> save(@ModelAttribute legalizacion legalizacion, @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return new ResponseEntity<>("El archivo es obligatorio", HttpStatus.BAD_REQUEST);
        }

        // Convertir el archivo a Base64
        legalizacion.setPdf(Base64.getEncoder().encodeToString(file.getBytes()));

        // Guardar la legalización
        legalizacionService.save(legalizacion);
        return new ResponseEntity<>(legalizacion, HttpStatus.OK);
    }

    @PostMapping("/pdf")
    public ResponseEntity<Object> guardarpdfJson(legalizacion legalizacion, @RequestParam("file") MultipartFile file) throws IOException{

        try{
            legalizacion.setPdf(Base64.getEncoder().encodeToString(file.getBytes()));

            int resultado = legalizacionService.guardarpdfJson(legalizacion);

            if (resultado == 0) {
                return new ResponseEntity<>(new respuestaPdf("Ok, se guardó correctamente"), HttpStatus.OK);
            }else {
                return new ResponseEntity<>(new respuestaPdf("Error al guardar"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Error al guardar el pdf: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

}
