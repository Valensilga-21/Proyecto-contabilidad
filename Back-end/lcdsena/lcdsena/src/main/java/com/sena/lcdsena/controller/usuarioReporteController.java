package com.sena.lcdsena.controller;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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

@RequestMapping("/api/v1/LCDSena/usuario/pdfReporte")
@CrossOrigin
@RestController
public class usuarioReporteController {

    @Autowired
    @Qualifier("usuarioService")
    private iusuarioService iusuarioService;

    @Autowired
    usuarioService usuarioService;

    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws JRException, FileNotFoundException {
        byte[] pdfBytes = iusuarioService.exportPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment()
            .filename("LISTADO_USUARIOS_REGISTRADOS.pdf")
            .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
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
