package com.sena.LCDSena.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.iusuario;
import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.usuario;

@Service
public class usuarioService implements iusuarioService{

    @Autowired
    private iusuario data;

    @Override
    public String save (usuario usuario){
        data.save(usuario);
        return usuario.getId_usuario();
    }

    @Override
    public List<usuario> findAll() {
        List<usuario> listaUsuarios = 
        (List<usuario>) data.findAll();
        return listaUsuarios;
    }

    @Override
    public Optional<usuario> findOne(String id) {
        Optional<usuario> usuario=data.findById(id);
        return usuario;
    }

    @Override
    public List<usuario> filtroUsuario(String filtro) {
        List<usuario> listaUsuarios=data.filtroUsuario(filtro);
        return listaUsuarios;
    }

    @Override
    public int delete(String id) {
        try{
            data.deleteById(id);
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }
}
