package com.sena.lcdsena.iservice;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.centro;
import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.registroRequest;
import com.sena.lcdsena.model.role;
import com.sena.lcdsena.model.usuario;

import net.sf.jasperreports.engine.JRException;

public interface iusuarioService {

    public String save (usuario usuario);
    public List<usuario> findAll();
    public Optional<usuario> findOne(String id);
    public List<usuario> filtroUsuario(String filtro);
    public List<usuario> filtroCentro(centro centro);
    public List<usuario> filtroRole(role role);
    public List<usuario> filtroEstado(estadoUsuario estado_usuario);
    public Optional<usuario> findByUsername(String username);
    public authResponse registro(registroRequest request);
    public void savePasswordResetToken(usuario usuario, String token);
    public int delete(String id_usuario);

    // PDF
    byte[] exportPdf() throws JRException, FileNotFoundException;

    byte[] exportXls() throws JRException, FileNotFoundException;
}
