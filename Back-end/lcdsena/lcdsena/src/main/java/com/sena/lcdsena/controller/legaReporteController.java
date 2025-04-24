package com.sena.lcdsena.controller;

import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.lcdsena.iservice.ilegalizacionService;
import com.sena.lcdsena.service.legalizacionService;

import net.sf.jasperreports.engine.JRException;

@RequestMapping("/api/v1/LCDSena/legalizacion/pdfReporte")
@CrossOrigin
@RestController
public class legaReporteController {

    @Autowired
    @Qualifier("legalizacionService")
    private ilegalizacionService ilegalizacionService;

    @Autowired
    legalizacionService legalizacionService;

    @GetMapping("/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws JRException, FileNotFoundException {
        byte[] pdfBytes = ilegalizacionService.exportPdf();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition
            .attachment()
            .filename("REPORTE_LEGALIZACIONES.pdf")
            .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
