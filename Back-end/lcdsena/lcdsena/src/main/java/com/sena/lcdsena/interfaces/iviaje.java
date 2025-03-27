package com.sena.lcdsena.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.viaje;

@Repository
public interface iviaje extends CrudRepository<viaje, String>{

    @Query("SELECT v FROM viaje v WHERE CAST(v.num_comision AS string) LIKE %?1% OR v.fecha_inicio = ?2 OR v.fecha_fin = ?2")
    List<viaje> filtroViaje(String numComision, LocalDate fecha);

}
