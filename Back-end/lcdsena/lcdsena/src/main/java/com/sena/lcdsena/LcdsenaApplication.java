package com.sena.lcdsena;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LcdsenaApplication {

	public static void main(String[] args) {
		SpringApplication.run(LcdsenaApplication.class, args);

		//GENENERAR SECRET KEY
		// System.out.println("Contraseña generada aleatoriamente: " + getBase64Key());
	}

	// private static final SecretKey secret_key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

	// private static String getBase64Key() {
	// 	var key = Base64.getEncoder().encodeToString(secret_key.getEncoded());
	// 	return key;
	// }

}
