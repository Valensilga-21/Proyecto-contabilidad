package com.sena.lcdsena.service;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.sena.lcdsena.interfaces.iusuario;
import com.sena.lcdsena.iservice.iusuarioService;
import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.loginRequest;
import com.sena.lcdsena.model.registroRequest;
import com.sena.lcdsena.model.role;
import com.sena.lcdsena.model.usuario;
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
                .estado_usuario(request.getEstado_Usuario())
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
        String Token = jwtService.getToken(usuario);
        return authResponse.builder().Token(Token).mensaje("Acceso Permitido").emailExists(false).build();
    }

    public Optional<authResponse> verificarToken(String Token) {
        try {// Verificacion token
            UserDetails userdetails = dataUser.findByUsername(jwtService.getUsernameFromToken(Token))
                    .orElse(null);
            if (userdetails != null && jwtService.isTokenValid(Token, userdetails)) {
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }

    @Override
	public void savePasswordResetToken(usuario usuario, String token) {
		// TODO Auto-generated method stub
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAll'");
    }


    @Override
    public Optional<usuario> findOne(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findOne'");
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

}
