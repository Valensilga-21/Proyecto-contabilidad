package com.sena.LCDSena.iservice;

import java.util.List;
import java.util.Optional;

import com.sena.LCDSena.model.legalizacion;

public interface ilegalizacionService {

    public String save (legalizacion legalizacion);
    public int guardarpdfJson(legalizacion legalizacion);
    public List<legalizacion> findAll();
    public Optional <legalizacion> findOne(String id_legalizacion);
    public int delete(String id_legalizacion);
    public List<legalizacion> filtroLegalizacion (String filtro);

    //CONTADORES
    long contarVencidas();
    long contarPendientes();
    long contarCompletadas();
}
