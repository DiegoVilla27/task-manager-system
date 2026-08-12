package com.diegovilla.task_manager.core.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

  private final JwtProperties jwtProperties;

  /**
   * Genera tanto el Access Token como el Refresh Token empaquetados en un JwtModel.
   *
   * @param subject Identificador del usuario (UUID o email).
   * @return Objeto JwtModel listo para enviarse en la respuesta.
   */
  public JwtModel generateToken(String subject) {
    Instant now = Instant.now();

    long expSecretSeconds = jwtProperties.expSecret(); // Ej. 3600 sg (1 hora)
    Instant accessExpiration = now.plusSeconds(expSecretSeconds);

    long expRefreshSeconds = jwtProperties.expRefresh(); // Ej. 604800 sg (7 días)
    Instant refreshExpiration = now.plusSeconds(expRefreshSeconds);

    // 1. Generar Access Token (JWT)
    String accessToken = Jwts.builder()
      .subject(subject)
      .issuedAt(Date.from(now))
      .expiration(Date.from(accessExpiration))
      .signWith(getSigningKey(true))
      .compact();

    // 2. Generar Refresh Token
    String refreshToken = Jwts.builder()
      .subject(subject)
      .issuedAt(Date.from(now))
      .expiration(Date.from(refreshExpiration))
      .signWith(getSigningKey(false))
      .compact();

    return new JwtModel(
      accessToken,
      refreshToken,
      expSecretSeconds
    );
  }

  public String extractSubject(String token, boolean isAccessToken) {
    return parseToken(token, isAccessToken)
      .getPayload()
      .getSubject();
  }

  public boolean isValid(String token, boolean isAccessToken) {
    try {
      parseToken(token, isAccessToken);
      return true;
    } catch (JwtException | IllegalArgumentException ex) {
      return false;
    }
  }

  private Jws<Claims> parseToken(String token, boolean isAccessToken) {
    return Jwts.parser()
      .verifyWith(getSigningKey(isAccessToken))
      .build()
      .parseSignedClaims(token);
  }

  private SecretKey getSigningKey(boolean isAccessToken) {
    return Keys.hmacShaKeyFor(
      isAccessToken
        ? jwtProperties.secret().getBytes(StandardCharsets.UTF_8)
        : jwtProperties.refresh().getBytes(StandardCharsets.UTF_8)
    );
  }
}
