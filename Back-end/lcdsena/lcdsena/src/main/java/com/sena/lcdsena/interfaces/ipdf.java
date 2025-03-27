package com.sena.lcdsena.interfaces;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.sena.lcdsena.model.pdf;

@Repository
public interface ipdf extends CrudRepository<pdf, String>{

}
