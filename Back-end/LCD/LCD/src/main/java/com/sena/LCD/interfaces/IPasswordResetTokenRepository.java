package com.sena.LCD.interfaces;

import org.springframework.data.repository.CrudRepository;

import com.sena.LCD.model.recuperarContrasena;

public interface IPasswordResetTokenRepository extends CrudRepository<recuperarContrasena, Long> {
    recuperarContrasena findByToken(String token);
}
