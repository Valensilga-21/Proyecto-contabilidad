package com.sena.LCDSena.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sena.LCDSena.iservice.iusuarioService;
import com.sena.LCDSena.model.usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/api/v1/LCDSena/usuario")
@RestController

public class usuarioController {

    @Autowired
    private iusuarioService usuarioService; 

    @PostMapping("/registrar")
    public ResponseEntity<Object> save(@RequestBody usuario usuario){

        if (usuario.getDocumento_usuario().equals("")) {
            return new ResponseEntity<>("El numero de documento es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }
        if (usuario.getNombre_usuario().equals("")) {
            return new ResponseEntity<>("El nombre es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }
        if (usuario.getCorreo_usuario().equals("")) {
            return new ResponseEntity<>("El correo es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }

        // if (usuario.getCentro().equals("")) {
            
        //     return new ResponseEntity<>("Seleccione un centro, este es un campo obligatorio", HttpStatus.BAD_REQUEST);
        // }
        // if (usuario.getCargo().equals("")) {
            
        //     return new ResponseEntity<>("Seleccione un cargo, este es un campo obligatorio", HttpStatus.BAD_REQUEST);
        // }

        if (usuario.getEstado_usuario().equals("")) {
            
            return new ResponseEntity<>("El estado es un campo obligatorio", HttpStatus.BAD_REQUEST);
        }

        usuarioService.save(usuario);
        return new ResponseEntity<>(usuario, HttpStatus.OK);
        
    }

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
        var listaUsuarios=usuarioService.filtroUsuario(filtro);
        return new ResponseEntity<>(listaUsuarios, HttpStatus.OK);
    }
    
    @DeleteMapping("/eliminar/{id_usuario}")
    public ResponseEntity<Object> delete(@PathVariable String id_usuario){
        usuarioService.delete(id_usuario);
        return new ResponseEntity<>("Usuario deshabilitado", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody usuario usuarioUpdate) {
        var usuario=usuarioService.findOne(id).get();
        if (usuario != null) {
            usuario.setDocumento_usuario(usuarioUpdate.getDocumento_usuario());
            usuario.setNombre_usuario(usuarioUpdate.getNombre_usuario());
            usuario.setCorreo_usuario(usuarioUpdate.getCorreo_usuario());
            usuario.setCentro(usuarioUpdate.getCentro());
            usuario.setCargo(usuarioUpdate.getCargo());
            usuario.setContrasena(usuarioUpdate.getContrasena());
            usuario.setConfirm_contrasena(usuarioUpdate.getConfirm_contrasena());
            usuario.setEstado_usuario(usuarioUpdate.getEstado_usuario());
            
            usuarioService.save(usuario);
            return new ResponseEntity<>(usuario, HttpStatus.OK);
        }else {
            return new ResponseEntity<>("No se pudieron guardar los cambios", HttpStatus.BAD_REQUEST);
        }
    }

    
}
