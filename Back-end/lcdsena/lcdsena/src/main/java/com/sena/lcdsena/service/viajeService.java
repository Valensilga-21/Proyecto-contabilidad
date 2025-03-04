package com.sena.lcdsena.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.iviaje;
import com.sena.lcdsena.iservice.iviajeService;
import com.sena.lcdsena.model.viaje;

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
    List<viaje> listaViajes =
    (List<viaje>) data.findAll();
    return listaViajes;
   }

   @Override
    public Optional<viaje> findOne(String id) {
    Optional<viaje> viaje=data.findById(id);
    return viaje;
   }

   @Override
    public List<viaje> filtroViaje(String filtro) {
        List<viaje> listaViajes=data.filtroViaje(filtro);
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
