package com.freelance.demo.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

import java.io.File;

/**
 * Loads .env file BEFORE Spring initializes properties
 * This ensures environment variables are available during application startup
 */
public class DotEnvContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        // Load .env file if it exists
        String envPath = ".env";
        if (new File(envPath).exists()) {
            Dotenv dotenv = Dotenv.configure()
                    .load();
            
            // Set each .env variable as system property so Spring can access it
            dotenv.entries().forEach(entry -> {
                String key = entry.getKey();
                String value = entry.getValue();
                
                // Only set if not already set by environment or system properties
                if (System.getProperty(key) == null && System.getenv(key) == null) {
                    System.setProperty(key, value);
                }
            });
        }
    }
}
