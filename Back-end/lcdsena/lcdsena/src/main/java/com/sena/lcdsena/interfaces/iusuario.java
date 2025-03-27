package com.sena.lcdsena.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.usuario;

@Repository
public interface iusuario extends JpaRepository<usuario, String> {
    
    @Query("SELECT u FROM usuario u WHERE " +
       "(LOWER(u.nombre_usuario) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
       "LOWER(u.username) LIKE LOWER(CONCAT('%', :filtro, '%'))) " +
       "AND (:estado IS NULL OR u.estado_usuario = :estado)")
    List<usuario> filtroUsuario(@Param("filtro") String filtro, @Param("estado") estadoUsuario estado);

    Optional<usuario> findByUsername(String username);
}
