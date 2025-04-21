package com.sena.lcdsena.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.estadoLegalizacion;
import com.sena.lcdsena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String> {

    @Query("SELECT l FROM legalizacion l WHERE l.fecha_soli = :fecha_soli")
    List<legalizacion> filtroFecha(@Param("fecha_soli") LocalDate fecha_soli);

    @Query("SELECT l FROM legalizacion l WHERE l.usuario.id_usuario = :id_usuario")
    List<legalizacion> findByUsuario_IdUsuario(@Param("id_usuario") String id_usuario);

    @Query("SELECT l FROM legalizacion l WHERE l.estado_lega = :estado_lega")
    List<legalizacion> filtroEstadosLega(@Param("estado_lega") estadoLegalizacion estado_lega);

    @Query("SELECT l FROM legalizacion l WHERE l.estado_lega = :estado_lega AND l.usuario.username = :username")
    List<legalizacion> filtroEstadoL(@Param("estado_lega") estadoLegalizacion estado_lega, @Param("username") String username);

    @Query("SELECT l FROM legalizacion l WHERE l.viaje.num_comision = :num_comision")
    List<legalizacion> filtroComision(@Param("num_comision") Integer num_comision);

    // @Query("SELECT l FROM Legalizacion l WHERE CAST(l.viaje.num_comision AS string) LIKE %:filtro%")
    // List<legalizacion> filtroComisionLike(@Param("filtro") String filtro);


}
