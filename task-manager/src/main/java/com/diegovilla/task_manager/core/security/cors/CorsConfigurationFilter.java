package com.diegovilla.task_manager.core.security.cors;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class CorsConfigurationFilter {

  /**
   * Define las reglas de acceso cruzado (CORS) de la API.
   */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 1. Orígenes permitidos (URL de tu Frontend en dev/prod)
    configuration.setAllowedOrigins(List.of(
        "http://localhost:4200", // Angular
        "http://localhost:3000" // React
    ));

    // 2. Métodos HTTP permitidos
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

    // 3. Cabeceras permitidas en las peticiones
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

    // 4. Cabeceras expuestas al cliente (para que el frontend pueda leer tokens si
    // fuera necesario)
    configuration.setExposedHeaders(List.of("Authorization"));

    // 5. Permitir credenciales (cookies/headers de autenticación)
    configuration.setAllowCredentials(true);

    // 6. Tiempo de caché para las respuestas Preflight (OPTIONS) en segundos (1
    // hora)
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Aplicar a todos los endpoints
    return source;
  }
}
