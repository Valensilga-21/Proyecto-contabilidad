package com.sena.LCDSena.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.usuario;

@Repository
public interface iusuario extends CrudRepository<usuario, String>{

    @Query("SELECT u FROM usuario u WHERE u.nombre_usuario LIKE %?1% OR u.correo_usuario LIKE %?1% OR u.documento_usuario LIKE %?1%")
    List<usuario> filtroUsuario(String filtro);

    @Query("SELECT u FROM usuario u WHERE u.correo_usuario = ?1")
    Optional<usuario> findByCorreoElec(String correo_usuario);
}
