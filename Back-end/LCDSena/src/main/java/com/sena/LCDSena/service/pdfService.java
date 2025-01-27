package com.sena.LCDSena.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.ipdf;
import com.sena.LCDSena.iservice.ipdfService;
import com.sena.LCDSena.model.pdf;

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
