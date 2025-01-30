package com.sena.LCDSena.service;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sena.LCDSena.interfaces.iusuario;
import com.sena.LCDSena.interfaces.iusuarioRepository;
import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.usuario;
import com.sena.LCDSena.util.usuarioReporte;

import net.sf.jasperreports.engine.JRException;

@Service
public class usuarioService implements iusuarioService {

    @Autowired
    private iusuario data;

    @Autowired
    private iusuarioRepository iusuarioRepository;

    @Autowired
    private usuarioReporte usuarioReporte;

    @Override
    public String save(usuario usuario) {
        data.save(usuario);
        return usuario.getId_usuario();
    }

    @Override
    public List<usuario> findAll() {
        List<usuario> listaUsuarios = (List<usuario>) data.findAll();
        return listaUsuarios;
    }

    @Override
    public Optional<usuario> findOne(String id) {
        Optional<usuario> usuario = data.findById(id);
        return usuario;
    }

    @Override
    public List<usuario> filtroUsuario(String filtro) {
        List<usuario> listaUsuarios = data.filtroUsuario(filtro);
        return listaUsuarios;
    }

    @Override
    public int delete(String id) {
        try {
            data.deleteById(id);
            return 1;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    // PDF
    @Override
    public byte[] exportPdf() throws JRException, FileNotFoundException {
        return usuarioReporte.exportToPdf(iusuarioRepository.findAll());
    }

    @Override
    public byte[] exportXls() throws JRException, FileNotFoundException {
        return usuarioReporte.exportToXls(iusuarioRepository.findAll());
    }

    //VERIFICAR SI YA EXISTE EL CORREO EN LA BD
    @Override
    public Optional<usuario> findByCorreoElec(String correo_usuario) {
        return data.findByCorreoElec(correo_usuario);
    }
}
