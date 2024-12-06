package com.sena.LCD.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//import com.sena.LCD.model.Respuesta;
import com.sena.LCD.model.usuario;
import com.sena.LCD.service.authService;
import com.sena.LCD.service.usuarioService;
import com.sena.LCD.IService.IUsuarioService;
import com.sena.LCD.controller.CambioContrasenaRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/api/v1/usuario/")
public class usuarioController {

    private final authService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private usuarioService usuarioService;

    @GetMapping("profile/")
    public ResponseEntity<usuario> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        usuario usuario = (usuario) auth.getPrincipal();
        return new ResponseEntity<usuario>(usuario, HttpStatus.OK);
    }

    @GetMapping("obtenerNombreUsuario/")
    public ResponseEntity<Map<String, String>> obtenerNombreUsuario() {
        try {
            // Obtener el correo electrónico del usuario autenticado a través del objeto
            // 'Principal'
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println(auth.getPrincipal());
            usuario usuario = (usuario) auth.getPrincipal();
            // String correoElectronico = principal.getName();

            // Buscar el usuario en la base de datos usando su correo electrónico
            // Si no se encuentra, lanzará una excepción UsernameNotFoundException
            // Usuario usuario = authService.findBycorreoElectronico(correoElectronico)
            // .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            // Crear un mapa que contendrá la respuesta, solo el nombre completo del usuario
            Map<String, String> response = new HashMap<>();
            response.put("nombre_usuario", usuario.getNombre_usuario()); // Añadir el nombre completo al mapa

            // Devolver la respuesta con el nombre completo y un código de estado HTTP 200
            // (OK)
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (UsernameNotFoundException e) {
            // Manejar el caso en el que no se encuentre el usuario
            // Crear un mapa para la respuesta de error
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Usuario no encontrado"); // Mensaje de error

            // Devolver una respuesta con el mensaje de error y un código de estado HTTP 404
            // (Not Found)
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);

        } catch (Exception e) {
            // Manejar cualquier otra excepción inesperada
            // Crear un mapa para la respuesta de error genérica
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("mensaje", "Error al obtener el perfil del usuario"); // Mensaje de error general

            // Devolver una respuesta con el mensaje de error y un código de estado HTTP 500
            // (Internal Server Error)
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("cambiarContrasena/")
    public ResponseEntity<String> cambiarContrasena(@RequestBody CambioContrasenaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("El token no es valido");
        }

        usuario user = (usuario) auth.getPrincipal();

        // Verificar que la contraseña antigua sea correcta
        if (!passwordEncoder.matches(request.getAntiguaContrasena(), user.getContra())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("La contraseña antigua no es correcta");
        }

        String nuevaContrasena = request.getNuevaContrasena();

        // Verificar que la nueva contraseña no sea igual a la antigua
        if (passwordEncoder.matches(nuevaContrasena, user.getContra())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("La nueva contraseña no puede ser igual a la antigua");
        }

        // Verificar que la nueva contraseña coincida con la confirmación
        if (!nuevaContrasena.equals(request.getConfirmarContrasena())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("La nueva contraseña y la confirmación no coinciden");
        }

        // Validar el formato de la nueva contraseña
        String contraRegex = "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,@_\\-$%&\\s]+$";
        Pattern contraPattern = Pattern.compile(contraRegex);
        Matcher contraMatcher = contraPattern.matcher(nuevaContrasena);

        if (!contraMatcher.matches()) {
            return new ResponseEntity<>("La contraseña solo puede contener letras, números y ciertos signos permitidos",
                    HttpStatus.BAD_REQUEST);
        }

        // Guardar la nueva contraseña encriptada
        user.setContra(passwordEncoder.encode(nuevaContrasena));
        usuarioService.save(user);

        // Enviar notificación por correo
        // emailService.enviarNotificacionCambioContra(user.getCorreoElectronico());
        return ResponseEntity.status(HttpStatus.OK).body("Contraseña cambiada exitosamente");
    }

    @PostMapping("recuperarContrasena/")
    public ResponseEntity<Map<String, String>> recuperarContrasena(@RequestBody RecuperarContrasenaRequest request) {
        Map<String, String> response = new HashMap<>();

        if (request.getCorreo_usuario() == null || request.getCorreo_usuario().isEmpty()) {
            response.put("message", "El correo es un campo obligatorio");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        java.util.Optional<usuario> optionalUsuario = usuarioService
                .findBycorreoElectronico(request.getCorreo_usuario());

        if (!optionalUsuario.isPresent()) {
            response.put("message", "El usuario no existe");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }

        usuario usuario = optionalUsuario.get();
        String token = UUID.randomUUID().toString();
        usuarioService.savePasswordResetToken(usuario, token);

        // CAMBIAR LINK DE RECUPERAR CONTRASEÑA
        String enlace = "http://127.0.0.1:5502/Front-end/html/recuperarContrasena.html?u=" +
                Base64.getEncoder().encodeToString(usuario.getUsername().getBytes()) +
                "&t=" + token;

        // emailService. enviarNotificacionRecuperarContra(usuario.getUsername(),
        // enlace);

        response.put("message", "Se ha enviado un enlace para recuperar la contraseña");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private boolean esContrasenaValida(String contraseña) {
        if (contraseña.length() < 8) {
            return false;
        }

        boolean tieneMayuscula = contraseña.chars().anyMatch(Character::isUpperCase);
        boolean tieneNumero = contraseña.chars().anyMatch(Character::isDigit);
        boolean tieneCaracterEspecial = contraseña.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");

        return tieneMayuscula && tieneNumero && tieneCaracterEspecial;
    }

    @PutMapping("cambioRecuperacionContrasena/")
    public ResponseEntity<Respuesta> cambiarContraseña(@RequestBody CambioRecuperaContrasenaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        usuario usuario = (usuario) auth.getPrincipal();
        var respuesta = new Respuesta("", "");

        String nuevaContrasena = request.getNuevaContrasena();

        if (passwordEncoder.matches(nuevaContrasena, usuario.getPassword())) {
            respuesta.setStatus(HttpStatus.BAD_REQUEST.toString());
            respuesta.setMessage("La nueva contraseña no puede ser igual a la anterior");
            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
        }

        if (!nuevaContrasena.equals(request.getConfirmarContrasena())) {
            respuesta.setStatus(HttpStatus.BAD_REQUEST.toString());
            respuesta.setMessage("La nueva contraseña y la confirmación no coinciden");
            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
        }

        if (!esContrasenaValida(nuevaContrasena)) {
            respuesta.setStatus(HttpStatus.BAD_REQUEST.toString());
            respuesta.setMessage(
                    "La nueva contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.");
            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
        }

        // Establecer la nueva contraseña
        usuario.setContra(passwordEncoder.encode(nuevaContrasena));
        usuario.setVerificarContrasena(false); //
        usuarioService.save(usuario);

        // Enviar correo de confirmación
        // emailService.enviarNotificacionCambioContra(Usuario.getUsername());

        // Configurar la respuesta de éxito
        respuesta.setStatus(HttpStatus.OK.toString());
        respuesta.setMessage("Cambio de contraseña exitoso");

        return new ResponseEntity<>(respuesta, HttpStatus.OK);
    }
}
