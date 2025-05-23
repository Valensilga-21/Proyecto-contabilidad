package com.sena.lcdsena.service;

import java.io.FileNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.sena.lcdsena.interfaces.IPasswordChangeTokenRepository;
import com.sena.lcdsena.interfaces.IPasswordResetTokenRepository;
import com.sena.lcdsena.interfaces.iusuario;
import com.sena.lcdsena.iservice.iusuarioService;
import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.cambiarContrasena;
import com.sena.lcdsena.model.centro;
import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.loginRequest;
import com.sena.lcdsena.model.registroRequest;
import com.sena.lcdsena.model.restablecerContrasena;
import com.sena.lcdsena.model.role;
import com.sena.lcdsena.model.usuario;
import com.sena.lcdsena.model.usuarioNoAprobadoException;

import lombok.RequiredArgsConstructor;
import net.sf.jasperreports.engine.JRException;

@Service
@RequiredArgsConstructor
public class authService implements iusuarioService{

    private final iusuario dataUser;
    private final jwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private iusuario data;

    @Autowired
    private iusuario iusuario;

    @Autowired
	private IPasswordResetTokenRepository tokenRepository;

    @Autowired
	private IPasswordChangeTokenRepository tokenChageRepository;

    @Autowired
    private UserDetailsService userDetailsService; // Inyectamos UserDetailsService

    // registro de usuarios
    @Override
    public authResponse registro(registroRequest request) {
        usuario userData = usuario.builder()
                .documento_usuario(request.getDocumento_usuario())
                .nombre_usuario(request.getNombre_usuario())
                .role(role.usuario)
                .username(request.getUsername())
                .centro(request.getCentro())
                .cargo(request.getCargo())
                .password(passwordEncoder.encode(request.getPassword()))
                .confirm_contrasena(passwordEncoder.encode(request.getConfirm_contrasena()))
                .estado_usuario(request.getEstado_usuario())
                .build();
        dataUser.save(userData);
        return authResponse.builder()
                .Token(jwtService.getToken(userData))
                .build();
    }

    // Metodo inicio de sesion
    public authResponse login(loginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        usuario usuario = findByUsername(request.getUsername()).orElseThrow();

        if (usuario.getEstado_usuario() != estadoUsuario.activo) {
            throw new usuarioNoAprobadoException("Usuario no aprobado. Contacte al administrador.");
        }

        String Token = jwtService.getToken(usuario);
        return authResponse.builder().Token(Token).mensaje("Acceso Permitido").emailExists(false).role(usuario.getRole()).id_usuario(usuario.getId_usuario()).nombre_usuario(usuario.getNombre_usuario()).build();
    }

    public Optional<authResponse> verificarToken(String Token) {
        try {// Verificacion token

            String username = jwtService.getUsernameFromToken(Token);

            UserDetails userdetails = dataUser.findByUsername(username).orElse(null);
            if (userdetails != null && jwtService.isTokenValid(Token, userdetails)) {

                usuario usuario = (usuario) userdetails;

                if (usuario.getEstado_usuario() != estadoUsuario.activo) {
                    return Optional.empty();
                }

                return Optional.of(authResponse.builder().Token(Token).mensaje("Token valido. usuario Registrado")
                        .emailExists(false).build());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public Optional<usuario> findByUsername(String username) {
        return dataUser.findByUsername(username);
    }

    @Override 
    public String save(usuario usuario) {
        data.save(usuario);
        return usuario.getId_usuario();
    }

    @Override
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
    public byte[] exportPdf() throws JRException, FileNotFoundException {
        throw new UnsupportedOperationException("Unimplemented method 'exportPdf'");
    }


    @Override
    public byte[] exportXls() throws JRException, FileNotFoundException {
        throw new UnsupportedOperationException("Unimplemented method 'exportXls'");
    }


    @Override
    public List<usuario> findAll() {
        List<usuario> listaUsuario = (List<usuario>) data.findAll();
        return listaUsuario;
    }


    @Override
    public Optional<usuario> findOne(String id) {
        Optional<usuario> usuario = data.findById(id);
        return usuario; 
    }


    @Override
	public List<usuario> filtroUsuario(String filtro) {
		List<usuario> ListaUsuario=data.filtroUsuario(filtro);
		return ListaUsuario;
	}

    @Override
    public List<usuario> filtroCentro(centro centro) {
        return data.filtroCentro(centro);
    }

    @Override
    public List<usuario> filtroRole(role role) {
        return data.filtroRole(role);
    }

    @Override
    public List<usuario> filtroEstado(estadoUsuario estado_usuario) {
        return data.filtroEstado(estado_usuario);
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
