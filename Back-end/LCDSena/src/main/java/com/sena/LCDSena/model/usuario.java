package com.sena.LCDSena.model;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.GenerationType;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="usuario")
public class usuario implements UserDetails{

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario", nullable = false, length = 36)
    private String id_usuario;

    @Column(name = "documento_usuario", nullable = false, length = 11)
    private String documento_usuario;

    @Column(name = "nombre_usuario", nullable = false, length = 150)
    private String nombre_usuario;

    @Column(name = "username", nullable = false, length = 255)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(name = "centro", nullable = false, length = 12)
    private centro centro;

    @Enumerated(EnumType.STRING)
    @Column(name = "cargo", nullable = false, length = 12)
    private cargo cargo;

    @Column(name = "password", nullable = false, length = 60)
    private String password;

    @Column(name = "confirm_contrasena", nullable = false, length = 60)
    private String confirm_contrasena;

    @Enumerated(EnumType.STRING)
    private estadoUsuario estado_usuario;

    @Enumerated(EnumType.STRING)
    private role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority(this.role.name()));
    }

    @Override
    public String getPassword() {
      return this.password;
    }
    @Override
    public String getUsername() {
        return this.username;
    }
}
