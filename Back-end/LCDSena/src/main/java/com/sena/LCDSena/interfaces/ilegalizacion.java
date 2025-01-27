package com.sena.LCDSena.interfaces;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.legalizacion;

@Repository
public interface ilegalizacion extends CrudRepository<legalizacion, String>{

}
