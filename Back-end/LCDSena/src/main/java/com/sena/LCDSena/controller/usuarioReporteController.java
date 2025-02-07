package com.sena.LCDSena.controller;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.usuario;
import com.sena.LCDSena.service.usuarioService;

import org.springframework.http.ContentDisposition;
import net.sf.jasperreports.engine.JRException;

@RequestMapping("/api/v1/LCDSena/pdfReporte")
@RestController
public class usuarioReporteController {

    @Autowired
    private iusuarioService iusuarioService;

    @Autowired
    usuarioService usuarioService;

    @PostMapping("/registrar")
    public ResponseEntity<Object> save(@RequestBody usuario usuario) {

        if (usuario.getDocumento_usuario().equals("")) {
            return new ResponseEntity<>("El numero de documento es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }
        if (usuario.getNombre_usuario().equals("")) {
            return new ResponseEntity<>("El nombre es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }
        if (usuario.getUsername().equals("")) {
            return new ResponseEntity<>("El correo es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }

        // if (usuario.getCentro().equals("")) {

        // return new ResponseEntity<>("Seleccione un centro, este es un campo
        // obligatorio", HttpStatus.BAD_REQUEST);
        // }
        // if (usuario.getCargo().equals("")) {

        // return new ResponseEntity<>("Seleccione un cargo, este es un campo
        // obligatorio", HttpStatus.BAD_REQUEST);
        // }

        if (usuario.getEstado_usuario().equals("")) {

            return new ResponseEntity<>("El estado es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }

        usuarioService.save(usuario);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @GetMapping("/listaUsuarios")
    public ResponseEntity<Object> findAll() {
        var listaUsuarios = usuarioService.findAll();
        return new ResponseEntity<>(listaUsuarios, HttpStatus.OK);
    }

    @GetMapping("/{id_usuario}")
    public ResponseEntity<Object> findOne(@PathVariable String id_usuario) {
        var usuario = usuarioService.findOne(id_usuario);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro/{filtro}")
    public ResponseEntity<Object> findFiltro(@PathVariable String filtro) {
        var listaUsuarios = usuarioService.filtroUsuario(filtro);
        return new ResponseEntity<>(listaUsuarios, HttpStatus.OK);
    }

    // pdf
    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws JRException, FileNotFoundException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("reporteUsuarios", "Listadousuarios.pdf");
        return ResponseEntity.ok().headers(headers).body(iusuarioService.exportPdf());
    }

    @GetMapping("/export-xls")
    public ResponseEntity<byte[]> exportXls() throws JRException, FileNotFoundException {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8");
        var contentDisposition = ContentDisposition.builder("attachment")
                .filename("reporteUsuarios" + ".xls").build();
        headers.setContentDisposition(contentDisposition);
        return ResponseEntity.ok()
                .headers(headers)
                .body(iusuarioService.exportXls());
    }
}
