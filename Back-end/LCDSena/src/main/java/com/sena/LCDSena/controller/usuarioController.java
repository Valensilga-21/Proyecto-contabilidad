package com.sena.LCDSena.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.usuario;
import com.sena.LCDSena.service.authService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/api/v1/LCDSena/usuario")
@RestController
@RequiredArgsConstructor
public class usuarioController {

    @Autowired
    private final authService authService;

    @Autowired
    private iusuarioService usuarioService;

    @GetMapping("profile/")
    public ResponseEntity<usuario> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        usuario usuario = (usuario) auth.getPrincipal();
        return new ResponseEntity<usuario>(usuario, HttpStatus.OK);
    }

    // @PostMapping("/registrar")
    // public ResponseEntity<Object> save(@RequestBody usuario usuario) {

    //     //VALIDACION DOCUMENTO
    //     if (usuario.getDocumento_usuario().equals("")) {
    //         return new ResponseEntity<>("El numero de documento es un campo obligatorio", HttpStatus.BAD_REQUEST);
    //     }

    //     String documento = usuario.getDocumento_usuario();
    //     if (!documento.matches("\\d{10}")) {
    //         return new ResponseEntity<>("El número de documento debe contener exactamente 10 dígitos numéricos", HttpStatus.BAD_REQUEST);
    //     }

    //     //NOMBRE VALIDACIONES
    //     if (usuario.getNombre_usuario().equals("")) {
    //         return new ResponseEntity<>("El nombre es un campo obligatorio", HttpStatus.BAD_REQUEST);
    //     }

    //     String nombreRegex = "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\\\\s]+$";
    //     Pattern  nombrePattern = Pattern.compile(nombreRegex);
    //     Matcher nombreMatcher = nombrePattern.matcher(usuario.getNombre_usuario());
    //     if (!nombreMatcher.matches()) {
    //         return new ResponseEntity<>("El nombre solo debe contener numero y letras", HttpStatus.OK);
    //     }

    //     //CORREO VALIDACIONES
    //     if (usuario.getUsername().equals("")) {
    //         return new ResponseEntity<>("El correo es un campo obligatorio", HttpStatus.BAD_REQUEST);
    //     }

    //     String correo_usuario = usuario.getUsername();
    //     String emailRegex = "^[^\\\\s@]+@[^\\\\s@]+\\\\.(com|es|org|net)$";

    //     Pattern pattern = Pattern.compile(emailRegex);
    //     Matcher matcher = pattern.matcher(correo_usuario);

    //     if (!matcher.matches()) {
    //         return new ResponseEntity<>("Correo no valido", HttpStatus.BAD_REQUEST);
    //     }

    //     String signosNoPermitidos = " \"<>{}[]?¿¡!|";

    //      // Construcción de la expresión regular para excluir los signos no permitidos
    //      String CorreoElectroRegex = "^[^" + signosNoPermitidos + "]*$";
    //      Pattern CorreoElectroPattern = Pattern.compile(CorreoElectroRegex);
    //      Matcher CorreoElectroMatcher = CorreoElectroPattern.matcher(usuario.getUsername());

    //      if (!CorreoElectroMatcher.matches()) {
    //         return new ResponseEntity<>("El correo electronico contiene caracteres no permitidos", HttpStatus.BAD_REQUEST);
    //     }

    //     //VALIDACIONES CENTRO
    //     if (usuario.getCentro() == null) {
    //         return new ResponseEntity<>("Seleccione un centro, este es un campo obligatorio", HttpStatus.BAD_REQUEST);
    //     }

    //     if (usuario.getCentro() != centro.cies && usuario.getCentro() != centro.direccion) {
    //         return new ResponseEntity<>("El valor del centro es inválido. Debe ser 'CIES' o 'DIRECCION'", HttpStatus.BAD_REQUEST);
    //     }

    //     //VALIDACIONES CARGO
    //     if (usuario.getCargo() == null) {
    //         return new ResponseEntity<>("Seleccione un cargo, este es un campo obligatorio", HttpStatus.BAD_REQUEST);
    //     }

    //     if (usuario.getCargo() != cargo.contratista && usuario.getCargo() != cargo.funcionario) {
    //         return new ResponseEntity<>("El valor del centro es inválido. Debe ser 'CIES' o 'DIRECCION'", HttpStatus.BAD_REQUEST);
    //     }

    //     //CONTRASEÑA VALIDACION
    //     if (usuario.getPassword().equals("")) {
    //         return new ResponseEntity<>("La contraseña es un campo obligstorio", HttpStatus.BAD_REQUEST);
    //     }

    //     String contrasenaRegex = "^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ0-9.,@_\\-$%&\\s]+$";
    //     Pattern contraPattern = Pattern.compile(contrasenaRegex);
    //     Matcher contraMatcher = contraPattern.matcher(usuario.getPassword());

    //     if (!contraMatcher.matches()) {
    //         return new ResponseEntity<>("La contraseña debe contener al menos una letra mayuscula, un numero, un carcater especial y al menos 8 digitos.", HttpStatus.BAD_REQUEST);
    //     }

    //     //CONFIRMACION DE LA CONTRASEÑA VALIDACION
    //     if (usuario.getConfirm_contrasena() != usuario.getPassword()) {
    //         return new ResponseEntity<>("Las contraseñas no coinciden", HttpStatus.BAD_REQUEST);
    //     }

    //     usuarioService.save(usuario);
    //     return new ResponseEntity<>(usuario, HttpStatus.OK);
    // }

    @GetMapping("/listaUsuarios")
    public ResponseEntity<Object> findAll() {
        var listaUsuarios = usuarioService.findAll();
        return new ResponseEntity<>(listaUsuarios, HttpStatus.OK);
    }

    @GetMapping("/{id_usuario}")
    public ResponseEntity<Object> findOne(@PathVariable String id_usuario) {
        var usuario = usuarioService.findOne(id_usuario);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro/{filtro}")
    public ResponseEntity<Object> findFiltro(@PathVariable String filtro) {
        var listaUsuarios = usuarioService.filtroUsuario(filtro);
        return new ResponseEntity<>(listaUsuarios, HttpStatus.OK);
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
            usuario.setPassword(usuarioUpdate.getPassword());
            usuario.setConfirm_contrasena(usuarioUpdate.getConfirm_contrasena());
            usuario.setEstado_usuario(usuarioUpdate.getEstado_usuario());

            usuarioService.save(usuario);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se pudieron guardar los cambios", HttpStatus.BAD_REQUEST);
        }
    }

}
