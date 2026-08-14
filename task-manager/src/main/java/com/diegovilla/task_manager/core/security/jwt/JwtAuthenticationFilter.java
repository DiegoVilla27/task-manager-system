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
import java.util.List;

/**
 * Spring Security filter that intercepts HTTP requests to validate JWT Bearer
 * tokens.
 *
 * <p>
 * Extracts the {@code Authorization} header, verifies token validity and
 * expiration via
 * {@link JwtService}, extracts the user identifier and role claim, and
 * populates the
 * {@link SecurityContextHolder} with the authenticated principal and
 * authorities.
 * </p>
 *
 * @since 1.0.0
 */
@Configuration
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;

  /**
   * Filters incoming requests to authenticate users via JWT Bearer tokens.
   *
   * @param request     the current HTTP servlet request.
   * @param response    the current HTTP servlet response.
   * @param filterChain execution filter chain to proceed if authenticated or
   *                    token absent.
   * @throws ServletException in case of general servlet processing errors.
   * @throws IOException      in case of I/O errors while reading or writing to
   *                          streams.
   */
  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      @NonNull HttpServletResponse response,
      @NonNull FilterChain filterChain) throws ServletException, IOException {

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

    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
        userId,
        null,
        authorities);

    SecurityContextHolder
        .getContext()
        .setAuthentication(authentication);

    filterChain.doFilter(request, response);
  }
}
