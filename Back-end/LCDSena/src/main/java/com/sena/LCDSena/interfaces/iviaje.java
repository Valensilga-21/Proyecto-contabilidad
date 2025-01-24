package com.sena.LCDSena.interfaces;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.viaje;

@Repository
public interface iviaje extends CrudRepository<viaje, String>{

}
