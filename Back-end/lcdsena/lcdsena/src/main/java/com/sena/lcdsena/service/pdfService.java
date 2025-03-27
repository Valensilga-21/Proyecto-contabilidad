package com.sena.lcdsena.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.ipdf;
import com.sena.lcdsena.iservice.ipdfService;
import com.sena.lcdsena.model.pdf;

@Service
public class pdfService implements ipdfService{

    @Autowired
    private ipdf data;

    @Override
    public String save(pdf pdf){
        data.save(pdf);
        return pdf.getId_pdf();
    }
}
