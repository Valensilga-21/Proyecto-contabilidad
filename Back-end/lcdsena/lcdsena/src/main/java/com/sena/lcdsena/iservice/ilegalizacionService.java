package com.sena.lcdsena.iservice;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.sena.lcdsena.model.legalizacion;

public interface ilegalizacionService {

    public String save (legalizacion legalizacion);
    public int guardarpdfJson(legalizacion legalizacion);
    public List<legalizacion> findAll();
    public Optional <legalizacion> findOne(String id_legalizacion);
    public int delete(String id_legalizacion);
    Optional<legalizacion> findById(String id);
    List<legalizacion> filtroFecha(LocalDate fecha_soli);
    public Long contarLegalizacionesRegistradas();
    public Long contarLegalizacionesPendientes();
    public Long contarLegalizacionesVencidas();
}
