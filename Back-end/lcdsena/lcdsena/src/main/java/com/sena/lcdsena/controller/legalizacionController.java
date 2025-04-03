package com.sena.lcdsena.controller;

import java.io.IOException;
import java.net.MalformedURLException;

import org.springframework.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.sena.lcdsena.interfaces.iusuarioRepository;
import com.sena.lcdsena.interfaces.iviajeRepository;
import com.sena.lcdsena.iservice.ilegalizacionService;
import com.sena.lcdsena.model.legalizacion;
import com.sena.lcdsena.model.legalizacionRequest;
import com.sena.lcdsena.model.usuario;
import com.sena.lcdsena.model.viaje;
import com.sena.lcdsena.service.legalizacionTokenService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RequestMapping("/api/v1/LCDSena/legalizacion")
@RestController
@RequiredArgsConstructor
public class legalizacionController {

    @Autowired
    private ilegalizacionService legalizacionService;

    @Autowired
    private iusuarioRepository usuarioRepository;

    @Autowired
    private iviajeRepository viajeRepository;

    private final legalizacionTokenService legalizacionTokenService;

    @PostMapping("/")
    public ResponseEntity<Object> save(@ModelAttribute legalizacionRequest request, 
                                    @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("El archivo es obligatorio");
            }

            // Buscar usuario en la BD
            usuario usuario = usuarioRepository.findById(request.getId_usuario())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

            // Buscar viaje en la BD
            viaje viaje = viajeRepository.findById(request.getId_viaje())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Viaje no encontrado"));

            // Definir la ruta donde se guardará el archivo
            String uploadDir = "uploads/legalizaciones/";
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            // Crear directorio si no existe
            Files.createDirectories(filePath.getParent());

            // Guardar archivo en el servidor
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Crear la legalización con la ruta del archivo
            legalizacion nuevaLegalizacion = legalizacion.builder()
                    .usuario(usuario)
                    .viaje(viaje)
                    .moti_devolucion(request.getMoti_devolucion())
                    .estado_lega(request.getEstado_lega())
                    .fecha_soli(request.getFecha_soli() != null ? request.getFecha_soli() : LocalDate.now())
                    .pdf(fileName)
                    .build();

            // Guardar en la BD
            legalizacionService.save(nuevaLegalizacion);

            // Generar el token de legalización
            String tokenLegalizacion = legalizacionTokenService.generarTokenLegalizacion(nuevaLegalizacion);

            return ResponseEntity.ok(Map.of("legalizacion", nuevaLegalizacion, "token", tokenLegalizacion));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar el archivo: " + e.getMessage());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar la legalización: " + e.getMessage());
        }
    }

    //Contadores
    @GetMapping("/registradas")
    public ResponseEntity<Long> contarLegalizacionesRegistradas() {
        return ResponseEntity.ok(legalizacionService.contarLegalizacionesRegistradas());
    }

    @GetMapping("/pendientes")
    public ResponseEntity<Long> contarLegalizacionesPendientes() {
        return ResponseEntity.ok(legalizacionService.contarLegalizacionesPendientes());
    }

    @GetMapping("/vencidas")
    public ResponseEntity<Long> contarLegalizacionesVencidas() {
        return ResponseEntity.ok(legalizacionService.contarLegalizacionesVencidas());
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        try {
            // Buscar la legalización por ID
            legalizacion legalizacion = legalizacionService.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Legalización no encontrada"));

            // Obtener la ruta del archivo
            String filePath = "uploads/legalizaciones/" + legalizacion.getPdf();
            Path path = Paths.get(filePath);

            // Verificar si el archivo existe
            if (!Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Cargar el archivo como recurso
            Resource resource = new UrlResource(path.toUri());

            // Devolver el archivo como respuesta
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(null);
        }
    }

    @GetMapping("/listaLega")
    public ResponseEntity<Object> findAll() {
        var litaLegalizaciones = legalizacionService.findAll();
        return new ResponseEntity<>(litaLegalizaciones, HttpStatus.OK);
    }

    @GetMapping("/{id_legalizacion}")
    public ResponseEntity<Object> findOne(@PathVariable String id_legalizacion) {
        var legalizacion = legalizacionService.findOne(id_legalizacion);
        return new ResponseEntity<>(legalizacion, HttpStatus.OK);
    }

    // @GetMapping("/busquedaFiltro")
    // public ResponseEntity<Object> findFiltro(@PathVariable String filtro) {
    //     var listaLegalizaciones = legalizacionService.filtroLegalizacion(filtro);
    //     return new ResponseEntity<>(listaLegalizaciones, HttpStatus.OK);
    // }

    @DeleteMapping("/deshabilitar/{id_legalizacion}")
    public ResponseEntity<Object> delete(@PathVariable String id_legalizacion) {
        legalizacionService.delete(id_legalizacion);
        return new ResponseEntity<>("Legalizacion deshabilitada", HttpStatus.OK);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestParam legalizacion legalizacionUpdate) {
        var legalizacion = legalizacionService.findOne(id).get();
        if (legalizacion != null) {
            legalizacion.setMoti_devolucion(legalizacionUpdate.getMoti_devolucion());
            legalizacion.setEstado_lega(legalizacionUpdate.getEstado_lega());

            legalizacionService.save(legalizacion);
            return new ResponseEntity<>(legalizacion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("No se guardaron los cambios, por favor intentelo de nuevo.",
                    HttpStatus.BAD_REQUEST);
        }
    }

}
