package com.sena.LCDSena.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.sena.LCDSena.interfaces.iusuario;
import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.authResponse;
import com.sena.LCDSena.model.loginRequest;
import com.sena.LCDSena.model.registroRequest;
import com.sena.LCDSena.model.role;
import com.sena.LCDSena.model.usuario;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class authService implements iusuarioService{


    private final iusuario dataUser;
    private final jwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService; // Inyectamos UserDetailsService

    // registro de usuarios
    @Override
    public authResponse registro(registroRequest request) {
        usuario userData = usuario.builder()
                .nombre_usuario(request.getNombre_usuario())
                .rol(role.usuario)
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .confirm_contrasena(passwordEncoder.encode(request.getConfirm_contrasena()))
                .build();
        dataUser.save(userData);
        return authResponse.builder()
                .Token(jwtService.getToken(userData))
                .build();
    }


    // METODO PARA INICIAR SESION
    public authResponse login(loginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        usuario usuario = findByUsername(request.getUsername()).orElseThrow();
        String Token = jwtService.getToken(usuario);
        return authResponse.builder().Token(Token).mensaje("Acceso Permitido").emailExists(false).build();
    }

    // //METODO DUPLICADO DE INICIO D SESION, PARA VERIFICAR EL TOKEN
    public Optional<authResponse> verificarToken(String Token) {
        try {// VERIFICAMOS EL TOKEN USANDO EL JWT
            UserDetails userdetails = dataUser.findByUsername(jwtService.getUsernameFromToken(Token))
                    .orElse(null);
            if (userdetails != null && jwtService.isTokenValid(Token, userdetails)) {
                return Optional.of(authResponse.builder().Token(Token).mensaje("Token valido. usuario Registrado")
                        .emailExists(false).build());
            }
        } catch (Exception e) {
            // MANEJAR CUALQUIER EXCEPCION QUE PUEDA OCURRIR DURANTE LA VERIFICACION DEL
            // TOKEN
            e.printStackTrace();
        }
        return Optional.empty();// TOKEN NO VALIDO o NO REGISTRADO
    }

    @Override
    public String save(usuario usuario) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
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
    public Optional<usuario> findByNombre_usuario(String nombre_usuario) {
        return dataUser.findByNombre_usuario(nombre_usuario);
    }

    // @Override
	// public void savePasswordResetToken(usuario usuario, String token) {
	// 	// TODO Auto-generated method stub
	// }

    @Override
    public Optional<usuario> findByUsername(String username) {
        return dataUser.findByUsername(username);
    }

}
