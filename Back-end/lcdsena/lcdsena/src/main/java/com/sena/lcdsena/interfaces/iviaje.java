package com.sena.lcdsena.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.estadoViaje;
import com.sena.lcdsena.model.viaje;

@Repository
public interface iviaje extends CrudRepository<viaje, String>{

    @Query("SELECT v FROM viaje v WHERE CAST(v.num_comision AS string) LIKE %?1%OR v.ruta LIKE %?1%")
    List<viaje> filtroViaje(String num_comision, LocalDate fecha, String ruta);

    @Query("SELECT v FROM viaje v WHERE CAST(v.num_comision AS string) LIKE %?1%OR v.ruta LIKE %?1% AND v.usuario.username = :username")
    List<viaje> filtroViajeU(String num_comision, LocalDate fecha, String ruta, @Param("username") String username);

    @Query("SELECT v FROM viaje v WHERE v.estado_viaje = :estado_viaje AND v.usuario.username = :username")
    List<viaje> filtroEstadoV(@Param("estado_viaje") estadoViaje estado_viaje, @Param("username") String username);

    @Query("SELECT v FROM viaje v WHERE v.fecha_fin = :fecha_fin AND v.notificadoLegalizacion = false")
    List<viaje> findByFechaFinAndNotificadoLegalizacionFalse(LocalDate fecha_fin);

    @Query("SELECT v FROM viaje v WHERE v.usuario.id_usuario = :id_usuario")
    List<viaje> findByUsuario_IdUsuario(@Param("id_usuario") String id_usuario);

    List<viaje> findAllByNotificadoLegalizacionFalse();


}
