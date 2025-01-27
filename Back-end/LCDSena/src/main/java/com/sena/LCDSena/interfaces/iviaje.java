package com.sena.LCDSena.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.viaje;

@Repository
public interface iviaje extends CrudRepository<viaje, String>{

    @Query("SELECT v FROM viaje v WHERE v.num_comision LIKE %?1% OR v.fecha_inicio = ?1 OR v.fecha_fin = ?1")
    List<viaje> filtroViaje(String filtro);
}
