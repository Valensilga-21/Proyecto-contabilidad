package com.sena.LCDSena.iservice;

import java.util.List;
import java.util.Optional;

import com.sena.LCDSena.model.usuario;

public interface iusuarioService {

    public String save(usuario usuario);
    public List<usuario> findAll();
    public Optional<usuario> findOne(String id_usuario);
    public int delete(String id_usuario);
    public List<usuario> filtroUsuario (String filtro);
}
