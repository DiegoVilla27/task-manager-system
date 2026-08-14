package com.diegovilla.task_manager;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main application entrypoint for the Task Manager platform.
 *
 * <p>Bootstraps Spring Boot, loads environment variables from local {@code .env} files
 * if present, and configures the embedded application context.</p>
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
    // 💡 Carga las variables del archivo .env a las propiedades del sistema
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    dotenv.entries().forEach(entry ->
      System.setProperty(entry.getKey(), entry.getValue())
    );
    SpringApplication.run(TaskManagerApplication.class, args);
	}
}

