package com.sena.lcdsena.interfaces;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.viaje;

@Repository
public interface iviajeRepository extends JpaRepository<viaje, String>{

}
