package com.sena.lcdsena.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.legalizacion;

@Repository
public interface ilegaRepository extends JpaRepository<legalizacion, String>{

}
