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

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(
    HttpSecurity http,
    JwtAuthenticationFilter jwtAuthenticationFilter,
    RateLimitingFilter rateLimitingFilter,
    CorsConfigurationFilter corsConfigurationFilter,
    @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver
  ) throws Exception {
    http
      .cors(cors -> cors.configurationSource(corsConfigurationFilter.corsConfigurationSource()))
      .csrf(AbstractHttpConfigurer::disable)
      .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers("/api-docs/**").permitAll()
        .anyRequest().authenticated()
      )
      .exceptionHandling(exception -> exception
        // 401: Delegas a Spring MVC
        .authenticationEntryPoint((request, response, authException) ->
          resolver.resolveException(request, response, null, authException)
        )
        // 403: Delegas a Spring MVC
        .accessDeniedHandler((request, response, accessDeniedException) ->
          resolver.resolveException(request, response, null, accessDeniedException)
        )
      )
      .addFilterBefore(
        jwtAuthenticationFilter,
        UsernamePasswordAuthenticationFilter.class
      )
      .addFilterAfter(
        rateLimitingFilter,
        UsernamePasswordAuthenticationFilter.class
      );

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
