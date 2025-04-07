package com.sena.lcdsena.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.centro;
import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.role;
import com.sena.lcdsena.model.usuario;

@Repository
public interface iusuario extends JpaRepository<usuario, String> {
    
    @Query("SELECT u FROM usuario u WHERE u.nombre_usuario LIKE %?1% OR u.username LIKE %?1% OR u.id_usuario LIKE %?1%OR u.documento_usuario LIKE %?1%")
    List<usuario> filtroUsuario(String filtro);

    @Query("SELECT u FROM usuario u WHERE u.centro = :centro")
    List<usuario> filtroCentro(@Param("centro") centro centro);

    @Query("SELECT u FROM usuario u WHERE u.role = :role")
    List<usuario> filtroRole(@Param("role") role role);

    @Query("SELECT u FROM usuario u WHERE u.estado_usuario = :estado_usuario")
    List<usuario> filtroEstado(@Param("estado_usuario") estadoUsuario estado_usuario);

    //Validacion correo
    Optional<usuario> findByUsername(String username);
}
