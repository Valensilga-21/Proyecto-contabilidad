package com.sena.LCD.interfaces;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sena.LCD.model.usuario;

@Repository
public interface IUsuario extends JpaRepository<usuario, String> {

    Optional<usuario> findByCorreoElectronico(String correo_usuario);

}
