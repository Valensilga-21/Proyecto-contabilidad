package com.sena.lcdsena.controller;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.lcdsena.iservice.iusuarioService;
import com.sena.lcdsena.service.usuarioService;

import org.springframework.http.ContentDisposition;
import net.sf.jasperreports.engine.JRException;

@RequestMapping("/api/v1/LCDSena/pdfReporte")
@CrossOrigin
@RestController
public class usuarioReporteController {

    @Autowired
    @Qualifier("usuarioService")
    private iusuarioService iusuarioService;

    @Autowired
    usuarioService usuarioService;

    // pdf
    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws JRException, FileNotFoundException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("reporteUsuarios", "LISTADO USUARIOS REGISTRADOS.pdf");
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
