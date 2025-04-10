package com.sena.lcdsena.interfaces;

import org.springframework.data.repository.CrudRepository;

import com.sena.lcdsena.model.cambiarContrasena;

public interface IPasswordChangeTokenRepository extends CrudRepository<cambiarContrasena, Long>{
    cambiarContrasena findByToken(String token);
}
