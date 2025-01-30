package com.sena.LCDSena.interfaces;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String> {

    @Query("SELECT l FROM legalizacion l WHERE l.fecha_soli = ?1")
    List<legalizacion> filtroLegalizacion(String filtro);

    //CONTADORES
    @Query("SELECT l FROM legalizacion l WHERE l.viaje.fecha_fin < :fechaLimite AND l.estado_lega IS NULL")
    List<legalizacion> findVencidas(Date fechaLimite);

    @Query("SELECT l FROM legalizacion l WHERE l.viaje.fecha_fin >= :fechaLimite AND l.estado_lega IS NULL")
    List<legalizacion> findPendientes(Date fechaLimite);

    @Query("SELECT l FROM legalizacion l WHERE l.estado_lega IS NOT NULL AND l.fecha_soli <= :fechaLimite")
    List<legalizacion> findCompletadas(Date fechaLimite);
}
