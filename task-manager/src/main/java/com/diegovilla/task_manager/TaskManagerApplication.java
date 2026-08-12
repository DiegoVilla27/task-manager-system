package com.diegovilla.task_manager;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TaskManagerApplication {

	public static void main(String[] args) {
    // 💡 Carga las variables del archivo .env a las propiedades del sistema
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    dotenv.entries().forEach(entry ->
      System.setProperty(entry.getKey(), entry.getValue())
    );
    SpringApplication.run(TaskManagerApplication.class, args);
	}

}
