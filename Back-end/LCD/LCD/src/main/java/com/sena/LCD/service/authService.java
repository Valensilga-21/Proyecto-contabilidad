package com.sena.LCD.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sena.LCD.IService.IUsuarioService;
import com.sena.LCD.interfaces.IUsuario;
import com.sena.LCD.model.authResponse;
import com.sena.LCD.model.loginRequest;
import com.sena.LCD.model.registroRequest;
import com.sena.LCD.model.role;
import com.sena.LCD.model.usuario;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class authService implements IUsuarioService {

    private final IUsuario dataUser;
    private final jwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService; // Inyectamos UserDetailsService

    // METODO PARA REGISTRAR EL USUARIO
    @Override
    public authResponse registro(registroRequest request) {
        usuario userData = usuario.builder()
                .nombre_usuario(request.getNombre_usuario())
                .role(role.usuario)
                .correo_usuario(request.getCorreo_usuario())
                .contra(passwordEncoder.encode(request.getContra()))
                .confirm_contra(passwordEncoder.encode(request.getConfirm_contra()))
                .build();
        dataUser.save(userData);
        return authResponse.builder()
                .Token(jwtService.getToken(userData))
                .build();
    }

    // METODO PARA INICIAR SESION
    public authResponse login(loginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo_usuario(), request.getContra()));
        usuario usuario = findBycorreoElectronico(request.getCorreo_usuario()).orElseThrow();
        String Token = jwtService.getToken(usuario);
        // return authResponse.builder().Token(Token).build();
        return authResponse.builder().Token(Token).mensaje("Acceso Permitido").emailExists(false).build();
    }

    // //METODO DUPLICADO DE INICIO D SESION, PARA VERIFICAR EL TOKEN
    public Optional<authResponse> verificarToken(String Token) {
        try {// VERIFICAMOS EL TOKEN USANDO EL JWT
            UserDetails userdetails = dataUser.findByCorreoElectronico(jwtService.getCorreoElectronicoFromToken(Token))
                    .orElse(null);
            if (userdetails != null && jwtService.isTokenValid(Token, userdetails)) {
                // return Optional.of(authResponse.builder().Token(Token).build());
                return Optional.of(authResponse.builder().Token(Token).mensaje("Token valido. Usuario Registrado")
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
    public String save(usuario Usuario) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }
}
