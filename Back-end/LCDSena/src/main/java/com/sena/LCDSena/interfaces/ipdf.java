package com.sena.LCDSena.interfaces;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCDSena.model.pdf;

@Repository
public interface ipdf extends CrudRepository<pdf, String>{

}
