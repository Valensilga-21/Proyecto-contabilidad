package com.sena.lcdsena.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.iviaje;
import com.sena.lcdsena.iservice.iviajeService;
import com.sena.lcdsena.model.estadoViaje;
import com.sena.lcdsena.model.viaje;

@Service
public class viajeService implements iviajeService{

    @Autowired
    private iviaje data;

    @Autowired
    private iviaje iviaje;

    @Autowired
    private emailService emailService;

    @Override
    public String save (viaje viaje){
        data.save(viaje);
        return viaje.getId_viaje();
   }

   @Override
   public List<viaje> findAll() {
    List<viaje> listaViajes =
    (List<viaje>) data.findAll();
    return listaViajes;
   }

   @Override
    public Optional<viaje> findOne(String id) {
    Optional<viaje> viaje=data.findById(id);
    return viaje;
   }

   @Override
    public List<viaje> filtroViaje(String filtro) {
        LocalDate fecha = null;
        String ruta = null;

        try {
            fecha = LocalDate.parse(filtro); // Intenta convertir a fecha
        } catch (DateTimeParseException e) {
            // No es una fecha, ignorar
        }

        return data.filtroViaje(filtro, fecha, ruta);
    }

    @Override
    public int delete(String id) {
        try{
            data.deleteById(id);
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    @Override
    public List<viaje> filtroEstadoV(estadoViaje estado_viaje) {
        return data.filtroEstadoV(estado_viaje);
    }


    //Notificar 5 días hábiles
    @Override
    public void enviarRecordatoriosPendientes() {
        LocalDate fechaFinEsperada = LocalDate.now().minusDays(1);
        List<viaje> viajes = iviaje.findByFechaFinAndNotificadoLegalizacionFalse(fechaFinEsperada);

        for (viaje viaje : viajes) {
            enviarRecordatorioLegalizacion(viaje);
        }
    }

    @Override
    public void enviarRecordatorioLegalizacion(viaje viaje) {
        String destinatario = viaje.getUsuario().getUsername();
        String nombre_usuario = viaje.getUsuario().getNombre_usuario();

        String resultado = emailService.enviarCorreoPlazo5Dias(destinatario, nombre_usuario);

        if ("Se envió correctamente".equals(resultado)) {
            viaje.setNotificadoLegalizacion(true);
            iviaje.save(viaje);
        } else {
            System.err.println("❌ No se pudo enviar correo al usuario: " + nombre_usuario);
        }
    }

    //Notificación 1 día hábil
    @Override
    public void enviarRecordatoriosPrevios() {
        LocalDate hoy = LocalDate.now();
        List<viaje> viajes = iviaje.findAllByNotificadoLegalizacionFalse();

        for (viaje viaje : viajes) {
            LocalDate fechaFinViaje = viaje.getFecha_fin();
            if (fechaFinViaje == null) continue;

            LocalDate fechaLimiteLegalizacion = sumarDiasHabiles(fechaFinViaje, 5);
            LocalDate fechaRecordatorio = sumarDiasHabiles(fechaLimiteLegalizacion, -1);

            if (hoy.isEqual(fechaRecordatorio)) {
                // Llama al nuevo correo
                String destinatario = viaje.getUsuario().getUsername();
                String nombre_usuario = viaje.getUsuario().getNombre_usuario();

                String resultadoUltimo = emailService.enviarCorreoUltimoDia(destinatario, nombre_usuario);

                if ("Se envió correctamente".equals(resultadoUltimo)) {
                    viaje.setNotificadoLegalizacion(true);
                    iviaje.save(viaje);
                } else {
                    System.err.println("❌ No se pudo enviar correo (último día) al usuario: " + nombre_usuario);
                }
            }
        }
    }


    // Sumar o restar días hábiles
    private LocalDate sumarDiasHabiles(LocalDate fechaInicio, int diasHabiles) {
        LocalDate fecha = fechaInicio;
        int contador = 0;

        if (diasHabiles > 0) {
            while (contador < diasHabiles) {
                fecha = fecha.plusDays(1);
                if (esDiaHabil(fecha)) {
                    contador++;
                }
            }
        } else {
            while (contador > diasHabiles) {
                fecha = fecha.minusDays(1);
                if (esDiaHabil(fecha)) {
                    contador--;
                }
            }
        }

        return fecha;
    }

    private boolean esDiaHabil(LocalDate fecha) {
        return !(fecha.getDayOfWeek() == java.time.DayOfWeek.SATURDAY ||
                fecha.getDayOfWeek() == java.time.DayOfWeek.SUNDAY);
    }

}
