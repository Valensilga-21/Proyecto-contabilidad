package com.sena.LCD.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCD.IService.IUsuarioService;
import com.sena.LCD.interfaces.IPasswordResetTokenRepository;
import com.sena.LCD.interfaces.IUsuario;
import com.sena.LCD.model.recuperarContrasena;
import com.sena.LCD.model.usuario;
import com.sena.LCD.model.authResponse;
import com.sena.LCD.model.registroRequest;

@Service
public class usuarioService implements IUsuarioService {

    @Autowired
    private IUsuario data;

    @Autowired
    private IPasswordResetTokenRepository tokenRepository;

    public void savePasswordResetToken(usuario usuario, String token) {
        recuperarContrasena resetToken = new recuperarContrasena();
        resetToken.setUsuario(usuario);
        resetToken.setToken(token);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Cambiado a 24 horas

        // Guarda el token en la base de datos
        tokenRepository.save(resetToken);
    }

    @Override
    public String save(usuario usuario) {
        data.save(usuario);
        return usuario.getId_usuario();
    }

    @Override
    public Optional<usuario> findBycorreoElectronico(String correo_usuario) {
        return data.findBycorreoElectronico(correo_usuario);
    }

    @Override
    public List<usuario> findAll() { /// MOSTRAR TODA LA LISTA
        List<usuario> ListaUsuario = (List<usuario>) data.findAll();
        return ListaUsuario;
    }

    @Override
    public Optional<usuario> findOne(String id) {
        Optional<usuario> usuario = data.findById(id);
        return usuario;
    }

    @Override
    public Optional<usuario> findBycorreoElectronico(String correo_usuario) {
        return data.findBycorreoElectronico(correo_usuario);
    }

}
