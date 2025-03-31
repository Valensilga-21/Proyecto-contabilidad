package com.sena.lcdsena.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sena.lcdsena.interfaces.iusuario;
import com.sena.lcdsena.model.authResponse;
import com.sena.lcdsena.model.estadoUsuario;
import com.sena.lcdsena.model.respuestaCambioContra;
import com.sena.lcdsena.model.usuario;
import com.sena.lcdsena.service.authService;
import com.sena.lcdsena.service.emailService;
import com.sena.lcdsena.service.usuarioService;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/LCDSena/usuario")
public class usuarioPrivController {

    private final authService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private iusuario data;

    @Autowired
    private usuarioService usuarioService;

    @Autowired
    private emailService emailService;

    @GetMapping("/")
    public ResponseEntity<Object> findAll() {
        var listaUsuario = usuarioService.findAll();
        return new ResponseEntity<>(listaUsuario, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> findOne(@PathVariable String id) {
        var usuario = usuarioService.findOne(id);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro/{filtro}")
    public ResponseEntity<Object> findFiltro(@PathVariable String filtro, 
                                         @RequestParam(required = false) String estado){

        List<usuario> listaUsuarios;

        estadoUsuario estadoEnum = null; // Inicializamos el estado como null

        if (estado != null && !estado.isEmpty()) {
            try {
                estadoEnum = estadoUsuario.valueOf(estado.toUpperCase()); // Convertir a ENUM
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Estado no válido");
            }
        }

        // Llamamos al método con ambos filtros (puede ser null el estado)
        listaUsuarios = usuarioService.filtroUsuario(filtro, estadoEnum);

        return ResponseEntity.ok(listaUsuarios);
    }


    @GetMapping("profile/")
    public ResponseEntity<usuario> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        usuario usuario = (usuario) auth.getPrincipal();
        return new ResponseEntity<usuario>(usuario, HttpStatus.OK);
    }

    @GetMapping("obtenerNombreusuario/")
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
            // usuario usuario = authService.findBycorreoElectronico(correoElectronico)
            // .orElseThrow(() -> new UsernameNotFoundException("usuario no encontrado"));

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
            errorResponse.put("mensaje", "usuario no encontrado"); // Mensaje de error

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

    //APROBAR REGISTRO DE USUARIO
    @PutMapping("/aprobar/{id_usuario}")
    public ResponseEntity<String> aprobarUsuario(@PathVariable String id_usuario) {
        Optional<usuario> usuarioOpt = data.findById(id_usuario);

        if (usuarioOpt.isPresent()) {
            usuario usuario = usuarioOpt.get();
            
            if (usuario.getEstado_usuario() == estadoUsuario.pendiente) {
                usuario.setEstado_usuario(estadoUsuario.activo);
                data.save(usuario);
                
                return new ResponseEntity<>("Solicitud de registro aprobada.", HttpStatus.OK);
                // emailService.enviarCorreoBienvenida(request.getUsername(), request.getNombre_usuario());
            } else {
                return new ResponseEntity<>("Su solicitud ya ha sido aprobada o rechazada.", HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>("Usuario no encontrado.", HttpStatus.NOT_FOUND);
    }


    @GetMapping("/verificar-acceso")
    public ResponseEntity<String> verificarAcceso(@RequestParam String token) {
        Optional<authResponse> response = authService.verificarToken(token);

        if (response.isPresent()) {
            // Token válido y usuario activo
            return new ResponseEntity<>("Acceso permitido", HttpStatus.OK);
        } else {
            // Token inválido o usuario no activo
            return new ResponseEntity<>("Acceso denegado. El usuario no está activo o el token es inválido.", HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("cambiarContrasena/")
    public ResponseEntity<String> cambiarContrasena(@RequestBody cambioContrasenaRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("El token no es valido");
        }

        usuario user = (usuario) auth.getPrincipal();

        // Verificar que la contraseña antigua sea correcta
        if (!passwordEncoder.matches(request.getActualContrasena(), user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("La contraseña antigua no es correcta");
        }

        String nuevaContrasena = request.getNuevaContrasena();

        // Verificar que la nueva contraseña no sea igual a la antigua
        if (passwordEncoder.matches(nuevaContrasena, user.getPassword())) {
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
        user.setPassword(passwordEncoder.encode(nuevaContrasena));
        usuarioService.save(user);

        // Enviar notificación por correo
        //emailService.enviarNotificacionCambioContra(user.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body("Contraseña cambiada exitosamente");
    }

    @PostMapping("/cerrar-sesion")
    public ResponseEntity<String> cerrarSesion() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            SecurityContextHolder.clearContext();
        }

        return ResponseEntity.ok("Sesión cerrada exitosamente. Por favor, elimine el token del lado del cliente.");
    }

    @PostMapping("recuperarContrasena/")
	public ResponseEntity<Map<String, String>> recuperarContrasena(@RequestBody recuperarContrasenaRequest request) {
	    Map<String, String> response = new HashMap<>();

	    if (request.getUsername() == null || request.getUsername().isEmpty()) {
	        response.put("message", "El correo es un campo obligatorio");
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    java.util.Optional<usuario> optionalUsuario = usuarioService.findByUsername(request.getUsername());

	    if (!optionalUsuario.isPresent()) {
	        response.put("message", "El usuario no existe");
	        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }

	    usuario usuario = optionalUsuario.get();
	    String token = UUID.randomUUID().toString();
	    usuarioService.savePasswordResetToken(usuario, token);

	    String enlace = "http://127.0.0.1:5501/Front-end/html/restablecercontraseña.html?u=" + 
	    	    Base64.getEncoder().encodeToString(usuario.getUsername().getBytes()) + 
	    	    "&t=" + token;


	    emailService.enviarNotificacionRestablecerContra(usuario.getUsername(), enlace, usuario.getNombre_usuario());

	    response.put("message", "Se ha enviado un enlace para recuperar la contraseña");
	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

    @PostMapping("notificacionCambioContrasena/")
	public ResponseEntity<Map<String, String>> cambiarContrasena(@RequestBody cambiarContrasenaRequest request) {
	    Map<String, String> response = new HashMap<>();

	    if (request.getUsername() == null || request.getUsername().isEmpty()) {
	        response.put("message", "El correo es un campo obligatorio");
	        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	    }

	    java.util.Optional<usuario> optionalUsuario = usuarioService.findByUsername(request.getUsername());

	    if (!optionalUsuario.isPresent()) {
	        response.put("message", "El usuario no existe");
	        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	    }

	    usuario usuario = optionalUsuario.get();
	    String token = UUID.randomUUID().toString();
	    usuarioService.changePasswordResetToken(usuario, token);

	    String enlaceCambio = "http://127.0.0.1:5501/Front-end/html/cambiarcontra.html?u=" + 
	    	    Base64.getEncoder().encodeToString(usuario.getUsername().getBytes()) + 
	    	    "&t=" + token;


	    emailService.enviarNotificacionCambiarContra(usuario.getUsername(), enlaceCambio, usuario.getNombre_usuario());

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

    @PutMapping("cambioRestablecerContrasena/")
	public ResponseEntity<respuestaCambioContra> restablecerContrasena(@RequestBody cambioRestablecerContrasenaRequest request) {
	    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	    usuario usuario = (usuario) auth.getPrincipal();
	    var respuesta = new respuestaCambioContra("", "");

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
	        respuesta.setMessage("La nueva contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, un número y un carácter especial.");
	        return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
	    }

	    // Establecer la nueva contraseña
	    usuario.setPassword(passwordEncoder.encode(nuevaContrasena));
	    usuario.setVerificarContrasena(false); //
	    usuarioService.save(usuario);

	    // Enviar correo de confirmación
	    // emailService.enviarNotificacionCambioContra(usuario.getUsername());

	    // Configurar la respuesta de éxito
	    respuesta.setStatus(HttpStatus.OK.toString());
	    respuesta.setMessage("Cambio de contraseña exitoso");

	    return new ResponseEntity<>(respuesta, HttpStatus.OK);
	}

    @DeleteMapping("/deshabilitar/{id_usuario}")
    public ResponseEntity<Object> delete(@PathVariable String id_usuario) {
        usuarioService.delete(id_usuario);
        return new ResponseEntity<>("Usuario deshabilitado", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody usuario usuarioUpdate) {
        var usuario = usuarioService.findOne(id).get();
        if (usuario != null) {
            usuario.setDocumento_usuario(usuarioUpdate.getDocumento_usuario());
            usuario.setNombre_usuario(usuarioUpdate.getNombre_usuario());
            usuario.setUsername(usuarioUpdate.getUsername());
            usuario.setCentro(usuarioUpdate.getCentro());
            usuario.setCargo(usuarioUpdate.getCargo());
            // usuario.setPassword(usuarioUpdate.getPassword());
            // usuario.setConfirm_contrasena(usuarioUpdate.getConfirm_contrasena());
            usuario.setEstado_usuario(usuarioUpdate.getEstado_usuario());
            usuario.setRole(usuarioUpdate.getRole());

            usuarioService.save(usuario);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se pudieron guardar los cambios", HttpStatus.BAD_REQUEST);
        }
    }
}
