package com.diegovilla.task_manager.core.openapi;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configures the application's OpenAPI (Swagger) specification.
 *
 * <p>This configuration registers the {@link OpenAPI} bean consumed by
 * Springdoc to automatically generate the API documentation exposed by
 * the application.</p>
 *
 * <p>The generated specification includes:</p>
 *
 * <ul>
 *   <li>General API metadata.</li>
 *   <li>Application version and description.</li>
 *   <li>Contact and license information.</li>
 *   <li>Available server environments.</li>
 *   <li>External project documentation.</li>
 *   <li>JWT Bearer authentication scheme.</li>
 *   <li>Global security requirements.</li>
 * </ul>
 *
 * <p>Additional OpenAPI components such as reusable schemas, responses,
 * examples, tags and request bodies can be registered here as the
 * application evolves.</p>
 *
 * @author Diego Villa
 * @since 1.0.0
 */
@Configuration
public class OpenApiConfig {

  @Value("${application.version}")
  private String version;

  @Value("${application.name}")
  private String name;

  /**
   * Creates the application's OpenAPI definition.
   *
   * <p>Builds the root {@link OpenAPI} object containing all metadata,
   * server definitions, security schemes and documentation settings
   * displayed by Swagger UI and other OpenAPI-compatible tools.</p>
   *
   * @return a fully configured {@link OpenAPI} instance.
   */
  @Bean
  public OpenAPI customOpenAPI() {
    return new OpenAPI()
      .info(
        new Info()
          .title(name)
          .version(version)
          .summary("REST API for task and user management.")
          .description("""
            Task Manager is a RESTful API built with Spring Boot following
            a layered and modular architecture.

            The API provides endpoints for managing users, tasks and future
            platform features such as authentication, authorization,
            permissions and system administration.
            """)
          .termsOfService("https://example.com/terms")
          .contact(
            new Contact()
              .name("Diego Villa")
              .email("cabuweb.info@gmail.com")
              .url("https://github.com/DiegoVilla27")
          )
          .license(
            new License()
              .name("Apache License 2.0")
              .url("https://www.apache.org/licenses/LICENSE-2.0")
          )
      )
      .servers(List.of(
        new Server()
          .url("http://localhost:8080")
          .description("Local Development Environment"),
        new Server()
          .url("https://api.taskmanager.com")
          .description("Production Environment")
      ))
      .externalDocs(
        new ExternalDocumentation()
          .description("Project Documentation")
          .url("https://github.com/DiegoVilla27/task-manager")
      )
      .components(
        new Components()
          .addSecuritySchemes(
            "Bearer Authentication",
            new SecurityScheme()
              .type(SecurityScheme.Type.HTTP)
              .scheme("bearer")
              .bearerFormat("JWT")
              .description("""
                JSON Web Token authentication.

                Enter only the JWT value. The 'Bearer' prefix is added
                automatically by Swagger UI.
                """)
          )
      )
      .addSecurityItem(
        new SecurityRequirement()
          .addList("Bearer Authentication")
      );
  }
}
