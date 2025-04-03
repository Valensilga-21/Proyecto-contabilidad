package com.sena.lcdsena.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.lcdsena.interfaces.iusuarioRepository;
import com.sena.lcdsena.iservice.iviajeService;
import com.sena.lcdsena.model.estadoViaje;
import com.sena.lcdsena.model.usuario;
import com.sena.lcdsena.model.viaje;
import com.sena.lcdsena.model.viajeRequest;
import com.sena.lcdsena.service.viajeTokenService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/api/v1/LCDSena/viaje")
@RestController
@RequiredArgsConstructor
public class viajeController {

    @Autowired
    private iviajeService viajeService;

    @Autowired
    private iusuarioRepository iusuarioRepository;

    private final viajeTokenService viajeTokenService;

    @PostMapping("/")
    public ResponseEntity<Object> save(@RequestBody viajeRequest request) {
        
        if (request.getNum_comision() == 0) {
            return new ResponseEntity<>("El número de comisión es obligatorio", HttpStatus.BAD_REQUEST);
        }
        if (request.getFecha_inicio() == null) {
            return new ResponseEntity<>("La fecha de inicio del viaje es obligatoria", HttpStatus.BAD_REQUEST);
        }
        if (request.getFecha_fin() == null) {
            return new ResponseEntity<>("La fecha de fin del viaje es obligatoria", HttpStatus.BAD_REQUEST);
        }
        if (request.getRuta() == null || request.getRuta().isEmpty()) {
            return new ResponseEntity<>("La ruta del viaje es obligatoria", HttpStatus.BAD_REQUEST);
        }
        if (request.getId_usuario() == null || request.getId_usuario().isEmpty()) {
            return new ResponseEntity<>("El ID del usuario es obligatorio", HttpStatus.BAD_REQUEST);
        }

        // Buscar usuario en la BD
        Optional<usuario> usuarioOpt = iusuarioRepository.findById(request.getId_usuario());
        if (!usuarioOpt.isPresent()) {
            return new ResponseEntity<>("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }

        Date fechaInicio = Date.valueOf(request.getFecha_inicio());
        Date fechaFin = Date.valueOf(request.getFecha_fin());

        // Determinar el estado del viaje automáticamente según la fecha de fin
        estadoViaje estadoInicial = fechaFin.toLocalDate().isBefore(LocalDate.now()) 
            ? estadoViaje.completado  
            : estadoViaje.pendiente;  

        viaje nuevoViaje = viaje.builder()
            .num_comision(request.getNum_comision())
            .fecha_inicio(request.getFecha_inicio() != null ? request.getFecha_inicio() : LocalDate.now())
            .fecha_fin(request.getFecha_fin() != null ? request.getFecha_fin() : LocalDate.now())
            .ruta(request.getRuta())
            .estado_viaje(estadoInicial) // Estado automático
            .usuario(usuarioOpt.get())
            .build();

        viajeService.save(nuevoViaje);

        String token = viajeTokenService.generarTokenViaje(nuevoViaje);

        return new ResponseEntity<>(Map.of(
            "viaje", nuevoViaje,
            "token", token
        ), HttpStatus.OK);
    }


    @GetMapping("/listaViajes")
    public ResponseEntity<Object> findAll() {
        var listaViajes = viajeService.findAll();
        return new ResponseEntity<>(listaViajes, HttpStatus.OK);
    }

    @GetMapping("/{id_viaje}")
    public ResponseEntity<Object> findOne(@PathVariable String id_viaje) {
        var viaje = viajeService.findOne(id_viaje);
        return new ResponseEntity<>(viaje, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro/{filtro}")
    public ResponseEntity<Object> findFiltro(@PathVariable String filtro) {
        var listaViajes = viajeService.filtroViaje(filtro);
        return new ResponseEntity<>(listaViajes, HttpStatus.OK);
    }

    @DeleteMapping("/eliminar/{id_viaje}")
    public ResponseEntity<Object> delete(@PathVariable String id_viaje){
        viajeService.delete(id_viaje);
        return new ResponseEntity<>("Usuario deshabilitado", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody viaje viajeUpdate){
        var viaje=viajeService.findOne(id).get();
        if (viaje != null) {
            viaje.setNum_comision(viajeUpdate.getNum_comision());
            viaje.setFecha_inicio(viajeUpdate.getFecha_inicio());
            viaje.setFecha_fin(viajeUpdate.getFecha_fin());
            viaje.setRuta(viajeUpdate.getRuta());
            viaje.setEstado_viaje(viajeUpdate.getEstado_viaje());

            viajeService.save(viaje);
            return new ResponseEntity<>(viaje, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("No se pudieron guardar los cambios, por favor intentelo de nuevo.", HttpStatus.BAD_REQUEST);
        }
    }
}
