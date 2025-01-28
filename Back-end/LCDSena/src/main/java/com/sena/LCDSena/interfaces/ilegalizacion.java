package com.sena.LCDSena.interfaces;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String> {

    @Query("SELECT l FROM legalizacion l WHERE l.fecha_soli = ?1")
    List<legalizacion> filtroLegalizacion(String filtro);
}
