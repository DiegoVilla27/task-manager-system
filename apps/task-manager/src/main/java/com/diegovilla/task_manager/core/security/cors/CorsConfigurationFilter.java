package com.diegovilla.task_manager.core.security.cors;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Cross-Origin Resource Sharing (CORS) configuration.
 *
 * <p>Defines allowed origins, HTTP methods, authorization headers, exposed headers, credentials
 * policy, and preflight max-age caching duration.
 *
 * @since 1.0.0
 */
@Configuration
@RequiredArgsConstructor
public class CorsConfigurationFilter {

    /**
     * Defines and registers the cross-origin access rules applied across all API endpoints.
     *
     * @return a configured {@link CorsConfigurationSource} mapped to all paths ({@code /**}).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. Orígenes permitidos (Localhost, Vercel y Render)
        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:[*]", // Local dev (React, Angular, etc.)
                        "https://*.vercel.app", // Vercel (Previews y Prod)
                        "https://*.onrender.com" // Render
                        ));

        // 2. Métodos HTTP permitidos
        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 3. Cabeceras permitidas en las peticiones
        configuration.setAllowedHeaders(
                List.of("Authorization", "Content-Type", "X-Requested-With"));

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
