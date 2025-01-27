package com.sena.LCDSena.controller;

import java.io.IOException;
import java.util.List;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.sena.LCDSena.model.Files;
import com.sena.LCDSena.service.FilesService;

public class FilesController {
    private static final Logger log = LoggerFactory.getLogger(FilesService.class);
	
	@Autowired
	private FilesService filesService;
	
	@PostMapping("/uploadFilesIntoDB")
	public ResponseEntity<String> storeFilesIntoDB(@RequestParam("file") MultipartFile file) throws IOException {
		log.info("Enter into uploadFilesIntoDB method");
		
		String response = filesService.storeFile(file);
		
		log.info("Completed uploadFilesIntoDB method with response {}", response);
		
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@GetMapping("/getFileByName/{fileName}")
	public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
		byte[] imageData = filesService.getFiles(fileName);
		
		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/png")).body(imageData);
	}
	
	@GetMapping("/files")
	public ResponseEntity<List<Files>> getAllFiles() {
		List<Files> imageData = filesService.getAllFiles();
		
		return ResponseEntity.status(HttpStatus.OK).body(imageData);
	}
	
	@PostMapping("/uploadFilesIntoFileSystem")
	public ResponseEntity<String> uploadFileIntoFileSystem(@RequestParam("file") MultipartFile file) throws IOException {
		String response = filesService.storeDataIntoFileSystem(file);
		
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@GetMapping("/getFilesFromFileSystem/{fileName}")
	public ResponseEntity<byte[]> downloadImageFromFileSystem(@PathVariable String fileName) {
		byte[] imageData = filesService.getFiles(fileName);
		
		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.valueOf("image/png")).body(imageData);
	}
}
