package com.freelance.demo;

import com.freelance.demo.config.DotEnvContextInitializer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(DemoApplication.class);
		// Load .env file BEFORE Spring initializes properties
		app.addInitializers(new DotEnvContextInitializer());
		app.run(args);
	}
}