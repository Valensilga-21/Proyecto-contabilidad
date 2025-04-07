package com.sena.lcdsena.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String> {

    @Query("SELECT l FROM legalizacion l WHERE l.fecha_soli = :fecha_soli")
    List<legalizacion> filtroFecha(@Param("fecha_soli") LocalDate fecha_soli);

}
