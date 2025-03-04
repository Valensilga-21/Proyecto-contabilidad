package com.sena.lcdsena.service;

import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.IPasswordResetTokenRepository;
import com.sena.lcdsena.iservice.iusuarioService;
import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.restablecerContrasena;
import com.sena.lcdsena.model.registroRequest;
import com.sena.lcdsena.model.usuario;

import net.sf.jasperreports.engine.JRException;
import com.sena.lcdsena.interfaces.iusuarioRepository;
import com.sena.lcdsena.interfaces.iusuario;
import com.sena.lcdsena.util.usuarioReporte;

@Service
@Primary
public class usuarioService implements iusuarioService {

    @Autowired
    private iusuario data;

    @Autowired
    private iusuarioRepository iusuarioRepository;

    @Autowired
    private usuarioReporte usuarioReporte;

    @Autowired
	private IPasswordResetTokenRepository tokenRepository;

	public void savePasswordResetToken(usuario usuario, String token) {
	    restablecerContrasena resetToken = new restablecerContrasena();
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
    public List<usuario> findAll() {  ///MOSTRAR TODA LA LISTA
        List<usuario> listaUsuario = (List<usuario>) data.findAll();
        return listaUsuario;
    }

    @Override
    public List<usuario> filtroUsuario(String filtro) {
        List<usuario> listaUsuarios = data.filtroUsuario(filtro);
        return listaUsuarios;
    }

    @Override
    public Optional<usuario> findOne(String id) {
        Optional<usuario> usuario = data.findById(id);
        return usuario; 
    }

    @Override
	    public Optional<usuario> findByUsername(String nombre_usuario) {
	    return data.findByUsername(nombre_usuario);

	}
    
    @Override
    public authResponse registro(registroRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'registro'");
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
}
