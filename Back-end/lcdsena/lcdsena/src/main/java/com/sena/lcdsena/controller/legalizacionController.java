package com.sena.lcdsena.controller;

import java.io.IOException;
import java.net.MalformedURLException;

import org.springframework.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.sena.lcdsena.model.estadoLegalizacion;
import com.sena.lcdsena.model.legalizacion;
import com.sena.lcdsena.model.legalizacionRequest;
import com.sena.lcdsena.model.usuario;
import com.sena.lcdsena.model.viaje;
import com.sena.lcdsena.service.emailService;
import com.sena.lcdsena.service.legalizacionTokenService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/api/v1/LCDSena/legalizacion")
@RestController
@RequiredArgsConstructor
@Data
public class legalizacionController {

    @Autowired
    private ilegalizacionService legalizacionService;

    @Autowired
    private iusuarioRepository usuarioRepository;

    @Autowired
    private iviajeRepository viajeRepository;

    @Autowired
    private emailService emailService;

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

    //Aprobar legalizacion
    @PutMapping("/{id}/estado")
    public ResponseEntity<Object> aprobarLegalizacion(@PathVariable String id) {
        try {
            var legalizacionOpt = legalizacionService.findOne(id);

            if (legalizacionOpt.isEmpty()) {
                return new ResponseEntity<>("Legalización no encontrada", HttpStatus.NOT_FOUND);
            }

            legalizacion legalizacion = legalizacionOpt.get();

            // Solo cambia el estado si está en pendiente
            if (legalizacion.getEstado_lega() == estadoLegalizacion.Pendiente) {
                legalizacion.setEstado_lega(estadoLegalizacion.Aprobada);
                legalizacionService.save(legalizacion);

                // Enviar correo electrónico al usuario
                String destinatario = legalizacion.getUsuario().getUsername(); // Ajusta según tu modelo
                String nombre_usuario = legalizacion.getUsuario().getNombre_usuario();
                int num_comision = legalizacion.getViaje().getNum_comision();
                String moti_devolucion = legalizacion.getMoti_devolucion();
                LocalDate fecha_soli = legalizacion.getFecha_soli();

                emailService.correoAprobacion(destinatario, nombre_usuario, num_comision, moti_devolucion, fecha_soli);
                return new ResponseEntity<>("Legalización aprobada correctamente", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("La legalización no está en estado PENDIENTE", HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            return new ResponseEntity<>("Error al actualizar el estado: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/estado/rechazar")
    public ResponseEntity<Object> rechazarLegalizacion(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            var legalizacionOpt = legalizacionService.findOne(id);

            if (legalizacionOpt.isEmpty()) {
                return new ResponseEntity<>("Legalización no encontrada", HttpStatus.NOT_FOUND);
            }

            legalizacion legalizacion = legalizacionOpt.get();

            if (legalizacion.getEstado_lega() != estadoLegalizacion.Pendiente) {
                return new ResponseEntity<>("La legalización no está en estado PENDIENTE", HttpStatus.BAD_REQUEST);
            }

            // Obtener el motivo del cuerpo de la petición
            String motivo = body.get("moti_devolucion");
            if (motivo == null || motivo.trim().isEmpty()) {
                return new ResponseEntity<>("Debe proporcionar un motivo de devolución", HttpStatus.BAD_REQUEST);
            }

            // Cambiar estado y guardar motivo
            legalizacion.setEstado_lega(estadoLegalizacion.Rechazada);
            legalizacion.setMoti_devolucion(motivo); // Asegúrate de tener este campo en tu modelo
            legalizacionService.save(legalizacion);

            // Enviar correo electrónico al usuario
            String destinatario = legalizacion.getUsuario().getUsername(); // Ajusta según tu modelo
            String nombre_usuario = legalizacion.getUsuario().getNombre_usuario();
            int num_comision = legalizacion.getViaje().getNum_comision();
            String moti_devolucion = legalizacion.getMoti_devolucion();
            LocalDate fecha_soli = legalizacion.getFecha_soli();

            emailService.correoDevolucion(destinatario, nombre_usuario, num_comision, moti_devolucion, fecha_soli);

            return new ResponseEntity<>("Legalización rechazada y notificada por correo", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error al procesar la solicitud: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/")
    public ResponseEntity<Object> findAll() {
        var litaLegalizaciones = legalizacionService.findAll();
        return new ResponseEntity<>(litaLegalizaciones, HttpStatus.OK);
    }

    @GetMapping("/usuario")
    public ResponseEntity<?> findByUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof usuario)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado.");
        }

        usuario usuarioAutenticado = (usuario) authentication.getPrincipal();

        String id_usuario = usuarioAutenticado.getId_usuario();

        List<legalizacion> legalizaciones = legalizacionService.findByUsuario(id_usuario);

        return ResponseEntity.ok(legalizaciones);
    }


    @GetMapping("/{id_legalizacion}")
    public ResponseEntity<Object> findOne(@PathVariable String id_legalizacion) {
        var legalizacion = legalizacionService.findOne(id_legalizacion);
        return new ResponseEntity<>(legalizacion, HttpStatus.OK);
    }

    @GetMapping("/busquedaFiltro/{num_comision}")
    public ResponseEntity<Object> findFiltro(@PathVariable Integer num_comision) {
        var listaLegalizacion = legalizacionService.filtroComision(num_comision);
        return new ResponseEntity<>(listaLegalizacion, HttpStatus.OK);
    }

    @GetMapping("/busqueda/fecha/{fecha_soli}")
    public ResponseEntity<Object> findByFecha(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha_soli) {
        var lista = legalizacionService.filtroFecha(fecha_soli);
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }

    //Filtros estados legalizacion para el admin
    @GetMapping("/busqueda/estadosA/{estado_lega}")
    public ResponseEntity<Object> findByEstadoLega(@PathVariable estadoLegalizacion estado_lega) {
        var listaLega = legalizacionService.filtroEstadosLega(estado_lega);
        return new ResponseEntity<>(listaLega, HttpStatus.OK);
    }

    //Filtro estados legalizacion para los usuarios
    @GetMapping("/busqueda/estado/{estado_lega}")
    public ResponseEntity<Object> findByEstadoL(@PathVariable estadoLegalizacion estado_lega, Authentication authentication) {

        String username = authentication.getName();

        // Filtrar las legalizaciones por estado y usuario
        var listaLega = legalizacionService.filtroEstadoL(estado_lega, username);

        return new ResponseEntity<>(listaLega, HttpStatus.OK);
    }


    @DeleteMapping("/deshabilitar/{id_legalizacion}")
    public ResponseEntity<Object> delete(@PathVariable String id_legalizacion) {
        legalizacionService.delete(id_legalizacion);
        return new ResponseEntity<>("Legalizacion deshabilitada", HttpStatus.OK);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<Object> updateLegalizacion(
            @PathVariable String id,
            @RequestParam(required = false) String moti_devolucion,
            @RequestParam(required = false) MultipartFile archivo,
            @RequestParam(required = false, defaultValue = "false") boolean archivoEliminado
    ) {
        Optional<legalizacion> optionalLega = legalizacionService.findOne(id);

        if (optionalLega.isEmpty()) {
            return new ResponseEntity<>("No se encontró la legalización con ese ID", HttpStatus.NOT_FOUND);
        }

        legalizacion legalizacion = optionalLega.get();

        // Validación segura del estado usando equals()
        if (estadoLegalizacion.Aprobada.equals(legalizacion.getEstado_lega())) {
            return new ResponseEntity<>("No se puede modificar una legalización aprobada.", HttpStatus.BAD_REQUEST);
        }

        boolean archivoModificado = false;

        // Eliminar archivo actual si se indicó
        if (archivoEliminado) {
            legalizacion.setPdf(null);
            archivoModificado = true;
        }

        // Subir nuevo archivo si aplica
        if (archivo != null && !archivo.isEmpty()) {
            try {
                String nombreArchivo = UUID.randomUUID().toString() + "_" + Paths.get(archivo.getOriginalFilename()).getFileName();
                Path pathDestino = Paths.get("uploads/legalizaciones", nombreArchivo);
                Files.createDirectories(pathDestino.getParent());
                Files.copy(archivo.getInputStream(), pathDestino, StandardCopyOption.REPLACE_EXISTING);
                legalizacion.setPdf(pathDestino.toString());
                archivoModificado = true;
                System.out.println("Archivo nuevo guardado: " + pathDestino);
            } catch (IOException e) {
                return new ResponseEntity<>("Error al guardar el archivo PDF", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        // Forzar estado a Pendiente si el archivo fue modificado
        if (archivoModificado) {
            legalizacion.setEstado_lega(estadoLegalizacion.Pendiente);
            legalizacion.setFecha_soli(LocalDate.now());
            System.out.println("Estado cambiado a Pendiente");
        }

        // Actualizar motivo si se proporciona
        if (moti_devolucion != null && !moti_devolucion.trim().isEmpty()) {
            legalizacion.setMoti_devolucion(moti_devolucion.trim());
        }

        legalizacionService.save(legalizacion);
        return new ResponseEntity<>(legalizacion, HttpStatus.OK);
    }

}
