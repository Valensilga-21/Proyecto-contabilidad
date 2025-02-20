package com.sena.LCDSena.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.usuario;

@Repository
public interface iusuario extends JpaRepository<usuario, String>{

    @Query("SELECT u FROM usuario u WHERE u.nombre_usuario LIKE %?1% OR u.username LIKE %?1% OR u.documento_usuario LIKE %?1%")
    List<usuario> filtroUsuario(String filtro);

    // @Query("SELECT u FROM usuario u WHERE u.username = ?1")
    // Optional<usuario> findByCorreoElec(String username);

    @Query("SELECT u FROM usuario u WHERE u.nombre_usuario = :nombre_usuario")
    Optional<usuario> findByNombre_usuario(String nombre_usuario);

    Optional<usuario> findByUsername(String username);
}
