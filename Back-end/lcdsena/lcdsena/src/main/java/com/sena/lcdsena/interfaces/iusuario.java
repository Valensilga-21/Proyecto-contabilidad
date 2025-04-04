package com.sena.lcdsena.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.usuario;

@Repository
public interface iusuario extends JpaRepository<usuario, String> {
    
    @Query("SELECT u FROM usuario u WHERE u.nombre_usuario LIKE %?1% OR u.username LIKE %?1% OR u.id_usuario LIKE %?1%OR u.documento_usuario LIKE %?1%")
    List<usuario> filtroUsuario(String filtro);

    Optional<usuario> findByUsername(String username);
}
