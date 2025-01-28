package com.sena.LCDSena.controller;

import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sena.LCDSena.iservice.ilegalizacionService;
import com.sena.LCDSena.model.legalizacion;
import com.sena.LCDSena.model.respuestaPdf;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/api/v1/LCDSena/legalizacion")
@RestController
public class legalizacionController {

    @Autowired
    private ilegalizacionService legalizacionService;

    @PostMapping("/")
    public ResponseEntity<Object> save(@ModelAttribute legalizacion legalizacion,
            @RequestParam("file") MultipartFile file) throws IOException {
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
    public ResponseEntity<Object> guardarpdfJson(legalizacion legalizacion, @RequestParam("file") MultipartFile file)
            throws IOException {

        try {
            legalizacion.setPdf(Base64.getEncoder().encodeToString(file.getBytes()));

            int resultado = legalizacionService.guardarpdfJson(legalizacion);

            if (resultado == 0) {
                return new ResponseEntity<>(new respuestaPdf("Ok, se guardó correctamente"), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new respuestaPdf("Error al guardar"), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (IOException e) {
            return new ResponseEntity<>("Error al guardar el pdf: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/listaLegalizaciones")
    public ResponseEntity<Object> findAll() {
        var litaLegalizaciones = legalizacionService.findAll();
        return new ResponseEntity<>(litaLegalizaciones, HttpStatus.OK);
    }

    @GetMapping("/{id_legalizacion}")
    public ResponseEntity<Object> findOne(@PathVariable String id_legalizacion) {
        var legalizacion = legalizacionService.findOne(id_legalizacion);
        return new ResponseEntity<>(legalizacion, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro")
    public ResponseEntity<Object> findFiltro(@PathVariable String filtro) {
        var listaLegalizaciones = legalizacionService.filtroLegalizacion(filtro);
        return new ResponseEntity<>(listaLegalizaciones, HttpStatus.OK);
    }

    @DeleteMapping("/deshabilitar/{id_legalizacion}")
    public ResponseEntity<Object> delete(@PathVariable String id_legalizacion) {
        legalizacionService.delete(id_legalizacion);
        return new ResponseEntity<>("Legalizacion deshabilitada", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestParam legalizacion legalizacionUpdate) {
        var legalizacion = legalizacionService.findOne(id).get();
        if (legalizacion != null) {
            legalizacion.setMoti_devolucion(legalizacionUpdate.getMoti_devolucion());
            legalizacion.setEstado_lega(legalizacionUpdate.getEstado_lega());
            legalizacion.setFecha_soli(legalizacionUpdate.getFecha_soli());

            legalizacionService.save(legalizacion);
            return new ResponseEntity<>(legalizacion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se guardaron los cambios, por favor intentelo de nuevo.",
                    HttpStatus.BAD_REQUEST);
        }
    }

}
