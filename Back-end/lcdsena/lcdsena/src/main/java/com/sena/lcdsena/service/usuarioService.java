package com.sena.lcdsena.service;

import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import com.sena.lcdsena.interfaces.IPasswordChangeTokenRepository;
import com.sena.lcdsena.interfaces.IPasswordResetTokenRepository;
import com.sena.lcdsena.iservice.iusuarioService;
import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.cambiarContrasena;
import com.sena.lcdsena.model.estadoUsuario;
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
    private iusuario iusuario;

    @Autowired
    private iusuarioRepository iusuarioRepository;

    @Autowired
    private usuarioReporte usuarioReporte;

    @Autowired
	private IPasswordResetTokenRepository tokenRepository;

    @Autowired
	private IPasswordChangeTokenRepository tokenChageRepository;

	public void savePasswordResetToken(usuario usuario, String token) {
	    restablecerContrasena resetToken = new restablecerContrasena();
	    resetToken.setUsuario(usuario);
	    resetToken.setToken(token);
	    resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Cambiado a 24 horas

	    // Guarda el token en la base de datos
	    tokenRepository.save(resetToken);
	}

	public void changePasswordResetToken(usuario usuario, String token) {
	    cambiarContrasena resetChangeToken = new cambiarContrasena();
	    resetChangeToken.setUsuario(usuario);
	    resetChangeToken.setToken(token);
	    resetChangeToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Cambiado a 24 horas

	    // Guarda el token en la base de datos
	    tokenChageRepository.save(resetChangeToken);
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
		List<usuario> ListaUsuario=data.filtroUsuario(filtro);
		return ListaUsuario;
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
    public int delete(String id_usuario) {
        try {
            // Buscar al usuario por su ID
            Optional<usuario> usuarioOpt = data.findById(id_usuario);

            if (usuarioOpt.isPresent()) {
                usuario usuario = usuarioOpt.get();
                
                // Cambiar el estado del usuario a "deshabilitado"
                usuario.setEstado_usuario(estadoUsuario.deshabilitado);

                // Guardar el usuario con el nuevo estado
                data.save(usuario);

                return 1; // Éxito
            } else {
                return 0;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return 0; // Error
        }
    }

}
