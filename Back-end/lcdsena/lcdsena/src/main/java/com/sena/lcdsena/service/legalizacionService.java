package com.sena.lcdsena.service;

import java.io.FileNotFoundException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.ilegalizacion;
import com.sena.lcdsena.iservice.ilegalizacionService;
import com.sena.lcdsena.model.estadoLegalizacion;
import com.sena.lcdsena.model.legalizacion;
import com.sena.lcdsena.util.legalizacionReporte;

import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;

import com.sena.lcdsena.interfaces.ilegaRepository;
import com.sena.lcdsena.interfaces.iviajeRepository;

@Service
@RequiredArgsConstructor
public class legalizacionService implements ilegalizacionService{

    @Autowired
    private ilegalizacion data;

    @Autowired
    private ilegaRepository ilegalizacionRepository;

    @Autowired
    private legalizacionReporte legalizacionReporte;

    @Autowired
    private ilegalizacion ilegalizacion;

    private final iviajeRepository iviajeRepository;
    private final ilegaRepository ilegaRepository;

    @Override
    public List<legalizacion> findByUsuario(String id_usuario) {
        return ilegalizacion.findByUsuario_IdUsuario(id_usuario);
    }

    @Override
    public String save(legalizacion legalizacion){
        data.save(legalizacion);
        return legalizacion.getId_legalizacion();
    }

    @Override
    public int guardarpdfJson(legalizacion legalizacion) {
        int res = 0;
        legalizacion = data.save(legalizacion);
        if (legalizacion.equals(null)) {
            res = 1;
        }
        return res;
    }

    @Override 
    public List<legalizacion> findAll() {
        List<legalizacion> listaLegalizaciones =
        (List<legalizacion>) data. findAll();
        return listaLegalizaciones;
    }

    @Override
    public Optional<legalizacion> findOne(String id){
        Optional<legalizacion> legalizacion=data.findById(id);
        return legalizacion;
    }

    @Override
    public List<legalizacion> filtroFecha(LocalDate fecha_soli) {
        return data.filtroFecha(fecha_soli);
    }

    @Override
    public List<legalizacion> filtroEstadosLega(estadoLegalizacion estado_lega) {
        return data.filtroEstadosLega(estado_lega);
    }

    @Override
    public List<legalizacion> filtroEstadoL(estadoLegalizacion estado_lega, String username) {
        return data.filtroEstadoL(estado_lega, username);
    }

    @Override
    public List<legalizacion> filtroComision(Integer num_comision) {
        return data.filtroComision(num_comision);
    }

    @Override
    public int delete(String id){
        try{
            data.deleteById(id);
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    @Override
     public Optional<legalizacion> findById(String id) {
         return ilegalizacionRepository.findById(id);
     }

    public Long contarLegalizacionesRegistradas() {
        return ilegaRepository.count();
    }

    public Long contarLegalizacionesPendientes() {
        LocalDate today = LocalDate.now();
        return iviajeRepository.findAll().stream()
            .filter(viaje -> viaje.getFecha_fin() != null) // Evitar NullPointerException
            .filter(viaje -> 
                viaje.getFecha_fin().isAfter(today) || 
                ChronoUnit.DAYS.between(viaje.getFecha_fin(), today) <= 5
            )
            .count();
    }
    
    public Long contarLegalizacionesVencidas() {
        LocalDate today = LocalDate.now();
        return iviajeRepository.findAll().stream()
            .filter(viaje -> viaje.getFecha_fin() != null) // Evitar NullPointerException
            .filter(viaje -> 
                viaje.getFecha_fin().isBefore(today.minusDays(5))
            )
            .count();
    }

    // PDF
    @Override
    public byte[] exportPdf() throws JRException, FileNotFoundException {
        return legalizacionReporte.exportToPdf(ilegaRepository.findAll());
    }
}
