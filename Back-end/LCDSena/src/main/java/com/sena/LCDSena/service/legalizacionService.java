package com.sena.LCDSena.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.ilegalizacion;
import com.sena.LCDSena.iservice.ilegalizacionService;
import com.sena.LCDSena.model.legalizacion;

@Service
public class legalizacionService implements ilegalizacionService{

    @Autowired
    private ilegalizacion data;

    @Override
    public String save(legalizacion legalizacion){
        data.save(legalizacion);
        return legalizacion.getId_legalizacion();
    }

    @Override
    public int guardarpdfJson(legalizacion legalizacion) {
        int res = 0;
        legalizacion = data.save(legalizacion);
        if (legalizacion.equals(null)) {
            res = 1;
        }
        return res;
    }
}
