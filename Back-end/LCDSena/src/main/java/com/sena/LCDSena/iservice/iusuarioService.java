package com.sena.LCDSena.iservice;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import com.sena.LCDSena.model.authResponse;
import com.sena.LCDSena.model.registroRequest;
import com.sena.LCDSena.model.usuario;

import net.sf.jasperreports.engine.JRException;

public interface iusuarioService {

    public String save(usuario usuario);

    public List<usuario> findAll();

    public Optional<usuario> findOne(String id_usuario);

    public int delete(String id_usuario);

    public List<usuario> filtroUsuario(String filtro);

    // PDF
    byte[] exportPdf() throws JRException, FileNotFoundException;

    byte[] exportXls() throws JRException, FileNotFoundException;


    public Optional <usuario> findByCorreoElec(String correo_usuario);

    //jwt
    // public void savePasswordResetToken(usuario usuario, String token);

    public authResponse registro(registroRequest request);

    public Optional<usuario>findByNombre_usuario(String usuario);
}
