package com.sena.lcdsena.interfaces;

import org.springframework.data.repository.CrudRepository;

import com.sena.lcdsena.model.restablecerContrasena;

public interface IPasswordResetTokenRepository extends CrudRepository<restablecerContrasena, Long> {
    restablecerContrasena findByToken(String token);
}
