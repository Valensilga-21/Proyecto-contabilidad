package com.sena.lcdsena.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.viaje;

@Repository
public interface iviaje extends CrudRepository<viaje, String>{

    @Query("SELECT v FROM viaje v WHERE CAST(v.num_comision AS string) LIKE %?1%")
    List<viaje> filtroViaje(String num_comision, LocalDate fecha);

    @Query("SELECT v FROM usuario v WHERE v.estado_viaje = :estado_viaje")
    List<viaje> filtroEstado(@Param("estado_viaje") estadoUsuario estado_viaje);

}
