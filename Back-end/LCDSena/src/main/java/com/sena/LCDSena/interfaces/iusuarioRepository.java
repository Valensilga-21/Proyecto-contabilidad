package com.sena.LCDSena.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.usuario;

@Repository
public interface iusuarioRepository extends JpaRepository<usuario, String> {

}
