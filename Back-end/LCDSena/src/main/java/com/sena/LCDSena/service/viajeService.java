package com.sena.LCDSena.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.iviaje;
import com.sena.LCDSena.iservice.iviajeService;
import com.sena.LCDSena.model.usuario;
import com.sena.LCDSena.model.viaje;

@Service
public class viajeService implements iviajeService{
    @Autowired
    private iviaje data;

    @Override
    public String save (viaje viaje){
        data.save(viaje);
        return viaje.getId_viaje();
   }

   @Override
   public List<viaje> findAll() {
    List <viaje> listaViajes =
    (List<viaje>) data.findAll();
    return listaViajes;
   }

   @Override Optional<viaje> findOne(String id) {
    Optional<viaje> viaje=data.findById(id);
    return viaje;
   }

   @Override
    public List<usuario> filtroViajes(String filtro) {
        List<usuario> listaViajes=data.filtroViajes(filtro);
        return listaViajes;
    }

    @Override
    public int delete(String id) {
        try{
            data.deleteById(id);
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }
}
