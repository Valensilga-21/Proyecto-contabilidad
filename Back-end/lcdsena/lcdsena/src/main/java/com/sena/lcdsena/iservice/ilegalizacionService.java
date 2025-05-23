package com.sena.lcdsena.iservice;

import java.io.FileNotFoundException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.sena.lcdsena.model.estadoLegalizacion;
import com.sena.lcdsena.model.legalizacion;

import net.sf.jasperreports.engine.JRException;

public interface ilegalizacionService {

    public String save (legalizacion legalizacion);
    public int guardarpdfJson(legalizacion legalizacion);
    public List<legalizacion> findAll();
    public Optional <legalizacion> findOne(String id_legalizacion);
    public int delete(String id_legalizacion);
    Optional<legalizacion> findById(String id);
    List<legalizacion> filtroFecha(LocalDate fecha_soli);
    public List<legalizacion> filtroEstadosLega(estadoLegalizacion estado_lega);
    public List<legalizacion> filtroEstadoL(estadoLegalizacion estado_lega, String username);
    public List<legalizacion> filtroComision(Integer filtroComision);
    public List<legalizacion> filtroComisionU(Integer filtroComision, String username);

    boolean existeLegalizacion(String id_usuario, String id_viaje);
    

    //Contadores
    public Long contarLegalizacionesRegistradas();
    public Long contarLegalizacionesPendientes();
    public Long contarLegalizacionesVencidas();

     // PDF
    byte[] exportPdf() throws JRException, FileNotFoundException;

    List<legalizacion> findByUsuario(String id_usuario);


}
