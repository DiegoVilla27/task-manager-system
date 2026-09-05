package com.diegovilla.task_manager.core.security;

import com.diegovilla.task_manager.core.security.cors.CorsConfigurationFilter;
import com.diegovilla.task_manager.core.security.jwt.JwtAuthenticationFilter;
import com.diegovilla.task_manager.core.security.jwt.JwtProperties;
import com.diegovilla.task_manager.core.security.ratelimit.RateLimitingFilter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

/**
 * Spring Security configuration establishing application security filters, stateless session
 * policies, endpoint authorization rules, and CORS/rate limiting integration.
 *
 * <p>Enables method security annotations (e.g. {@code @PreAuthorize}) and registers custom filters
 * for JWT authentication and token-bucket rate limiting.
 *
 * @since 1.0.0
 */
@Configuration
@EnableConfigurationProperties(JwtProperties.class)
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * Configures the main Spring Security filter chain.
     *
     * @param http the {@link HttpSecurity} builder to configure.
     * @param jwtAuthenticationFilter filter validating JWT bearer tokens on incoming requests.
     * @param rateLimitingFilter filter enforcing token-bucket rate limits per client.
     * @param corsConfigurationFilter CORS source provider for cross-origin web requests.
     * @param resolver Spring MVC exception resolver for delegating 401/403 errors.
     * @return the configured {@link SecurityFilterChain}.
     * @throws Exception if a security configuration error occurs during building.
     */
    @Bean
    @SuppressWarnings({"java:S112", "java:S4502"})
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            RateLimitingFilter rateLimitingFilter,
            CorsConfigurationFilter corsConfigurationFilter,
            @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver)
            throws Exception {
        http.cors(
                        cors ->
                                cors.configurationSource(
                                        corsConfigurationFilter.corsConfigurationSource()))
                // CSRF is disabled because authentication is stateless via JWT tokens in
                // Authorization headers (no session cookies)
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(
                        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        auth ->
                                auth.requestMatchers("/auth/**")
                                        .permitAll()
                                        .requestMatchers("/api-docs/**")
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated())
                .exceptionHandling(
                        exception ->
                                exception
                                        // 401: Delegas a Spring MVC
                                        .authenticationEntryPoint(
                                                (request, response, authException) ->
                                                        resolver.resolveException(
                                                                request,
                                                                response,
                                                                null,
                                                                authException))
                                        // 403: Delegas a Spring MVC
                                        .accessDeniedHandler(
                                                (request, response, accessDeniedException) ->
                                                        resolver.resolveException(
                                                                request,
                                                                response,
                                                                null,
                                                                accessDeniedException)))
                .addFilterBefore(
                        jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Provides the password encoder bean used for hashing and verifying passwords.
     *
     * @return a {@link BCryptPasswordEncoder} instance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
