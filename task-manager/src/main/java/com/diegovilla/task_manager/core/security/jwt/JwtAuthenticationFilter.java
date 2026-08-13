package com.diegovilla.task_manager.core.security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    @NonNull HttpServletResponse response,
    @NonNull FilterChain filterChain
  ) throws ServletException, IOException {

    String authorization = request.getHeader("Authorization");

    if (authorization == null || !authorization.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    String token = authorization.substring(7);

    if (!jwtService.isValid(token, true)) {
      filterChain.doFilter(request, response);
      return;
    }

    String userId = jwtService.extractSubject(token, true);
    String role = jwtService.extractRole(token); // ej: "ADMIN"

    List<SimpleGrantedAuthority> authorities = List.of(
      new SimpleGrantedAuthority("ROLE_" + role) // Resulta en: "ROLE_ADMIN" o "ROLE_USER"
    );

    UsernamePasswordAuthenticationToken authentication =
      new UsernamePasswordAuthenticationToken(
        userId,
        null,
        authorities
      );

    SecurityContextHolder
      .getContext()
      .setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }
}
