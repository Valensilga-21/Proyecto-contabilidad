package com.sena.lcdsena.iservice;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.sena.lcdsena.model.estadoViaje;
import com.sena.lcdsena.model.viaje;


public interface iviajeService {

    public String save(viaje viaje);
    public List<viaje> findAll();
    public Optional<viaje> findOne(String id_viaje);
    public int delete(String id_viaje);
    public List<viaje> filtroViaje (String filtro);
    public List<viaje> filtroEstadoV(estadoViaje estado_viaje);

    //Notificaciones

    //5 días hábiles
    void enviarRecordatoriosPendientes();
    void enviarRecordatorioLegalizacion(viaje viaje);

    //1 días hábil
    void enviarRecordatoriosPrevios();

}
