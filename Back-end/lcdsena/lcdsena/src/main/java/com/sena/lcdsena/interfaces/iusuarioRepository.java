package com.sena.lcdsena.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.usuario;

@Repository
public interface iusuarioRepository extends JpaRepository<usuario, String> {

}
