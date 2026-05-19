package com.freelance.demo.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

import java.io.File;

/**
 * Load environment variables from .env file
 * This configuration loads .env file at application startup
 */
@Configuration
public class DotEnvConfig {

    public DotEnvConfig() {
        // Load .env file if it exists
        String envPath = ".env";
        if (new File(envPath).exists()) {
            Dotenv.configure()
                    .load()
                    .entries()
                    .forEach(entry -> {
                        if (System.getenv(entry.getKey()) == null) {
                            System.setProperty(entry.getKey(), entry.getValue());
                        }
                    });
        }
    }
}
