package com.sena.LCDSena.service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.ilegalizacion;
import com.sena.LCDSena.iservice.ilegalizacionService;
import com.sena.LCDSena.model.legalizacion;

@Service
public class legalizacionService implements ilegalizacionService{

    @Autowired
    private ilegalizacion data;

    @Autowired
    private ilegalizacion ilegalizacion;

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

    @Override 
    public List<legalizacion> findAll() {
        List<legalizacion> listaLegalizaciones =
        (List<legalizacion>) data. findAll();
        return listaLegalizaciones;
    }

    @Override
    public Optional<legalizacion> findOne(String id){
        Optional<legalizacion> legalizacion=data.findById(id);
        return legalizacion;
    }

    @Override
    public List<legalizacion> filtroLegalizacion(String filtro){
        List<legalizacion> listaLegalizaciones=data.filtroLegalizacion(filtro);
        return listaLegalizaciones;
    }

    @Override
    public int delete(String id){
        try{
            data.deleteById(id);
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    //CONTADORES
    public long contarVencidas() {
        Date fechaLimite = Date.valueOf(LocalDate.now().minusDays(5));
        return ilegalizacion.findVencidas(fechaLimite).size();
    }

    public long contarPendientes() {
        Date fechaLimite = Date.valueOf(LocalDate.now());
        return ilegalizacion.findPendientes(fechaLimite).size();
    }

    public long contarCompletadas() {
        Date fechaLimite = Date.valueOf(LocalDate.now());
        return ilegalizacion.findCompletadas(fechaLimite).size();
    }
}
