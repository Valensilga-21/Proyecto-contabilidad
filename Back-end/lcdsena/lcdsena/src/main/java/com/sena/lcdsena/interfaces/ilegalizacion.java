package com.sena.lcdsena.interfaces;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String> {

    // @Query("SELECT l FROM legalizacion l WHERE l.fecha_soli = ?1")
    // List<legalizacion> filtroLegalizacion(String filtro);
}
