package com.diegovilla.task_manager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application entrypoint for the Task Manager platform.
 *
 * <p>Bootstraps Spring Boot, loads environment variables from local {@code .env} files if present,
 * and configures the embedded application context.
 *
 * @author Diego Villa
 * @since 1.0.0
 */
@SpringBootApplication
public class TaskManagerApplication {

    /**
     * Application execution entrypoint.
     *
     * @param args command-line execution arguments.
     */
    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
