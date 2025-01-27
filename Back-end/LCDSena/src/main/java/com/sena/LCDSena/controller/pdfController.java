package com.sena.LCDSena.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCDSena.iservice.ipdfService;
import com.sena.LCDSena.model.pdf;

import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@RequestMapping("/api/v1/LCDSena/pdf")
@RestController
public class pdfController {

    @Autowired
    private ipdfService pdfService;

    @PostMapping("/")
    public ResponseEntity<Object> save (@ModelAttribute("pdf") pdf pdf) {
        
        if (pdf.getPdf().equals("")) {
            return new ResponseEntity<>("Seleccione un PDF", HttpStatus.BAD_REQUEST);
        }

        pdfService.save(pdf);
        return new ResponseEntity<>(pdf, HttpStatus.OK);
    }
    
}
