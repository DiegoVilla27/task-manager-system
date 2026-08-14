package com.diegovilla.task_manager.core.security.jwt;

import com.diegovilla.task_manager.features.user.domain.valueobjects.UserRole;
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

/**
 * Service responsible for generating, parsing, and validating JSON Web Tokens (JWT).
 *
 * <p>Handles separate signing keys and expiration periods for short-lived access tokens
 * and long-lived refresh tokens using the HMAC-SHA algorithm.</p>
 *
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
public class JwtService {

  private final JwtProperties jwtProperties;

  /**
   * Generates both an Access Token and a Refresh Token packaged into a {@link JwtModel}.
   *
   * @param subject user identifier (UUID string or email).
   * @param role    user role for authority claims in the token.
   * @return a hydrated {@link JwtModel} containing both tokens and access expiration lifetime.
   */
  public JwtModel generateToken(String subject, UserRole role) {
    Instant now = Instant.now();

    long expSecretSeconds = jwtProperties.expSecret(); // Ej. 3600 sg (1 hora)
    Instant accessExpiration = now.plusSeconds(expSecretSeconds);

    long expRefreshSeconds = jwtProperties.expRefresh(); // Ej. 604800 sg (7 días)
    Instant refreshExpiration = now.plusSeconds(expRefreshSeconds);

    // 1. Generar Access Token (JWT)
    String accessToken = Jwts.builder()
      .subject(subject)
      .claim("role", role.toString())
      .issuedAt(Date.from(now))
      .expiration(Date.from(accessExpiration))
      .signWith(getSigningKey(true))
      .compact();

    // 2. Generar Refresh Token
    String refreshToken = Jwts.builder()
      .subject(subject)
      .claim("role", role.toString())
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

  /**
   * Extracts the subject claim (user ID) from a signed JWT token.
   *
   * @param token         the JWT token string.
   * @param isAccessToken {@code true} if parsing an access token, {@code false} for a refresh token.
   * @return the subject extracted from the token claims payload.
   * @throws JwtException if token signature is invalid or expired.
   */
  public String extractSubject(String token, boolean isAccessToken) {
    return parseToken(token, isAccessToken)
      .getPayload()
      .getSubject();
  }

  /**
   * Extracts the user role claim from a signed access token.
   *
   * @param token the JWT access token string.
   * @return the string name of the role claim.
   * @throws JwtException if token signature is invalid or expired.
   */
  public String extractRole(String token) {
    return parseToken(token, true)
      .getPayload()
      .get("role", String.class);
  }

  /**
   * Checks whether a JWT token has a valid cryptographic signature and is not expired.
   *
   * @param token         the JWT token string to validate.
   * @param isAccessToken {@code true} if validating an access token, {@code false} for a refresh token.
   * @return {@code true} if the token is structurally and cryptographically valid and active; {@code false} otherwise.
   */
  public boolean isValid(String token, boolean isAccessToken) {
    try {
      parseToken(token, isAccessToken);
      return true;
    } catch (JwtException | IllegalArgumentException ex) {
      return false;
    }
  }

  /**
   * Parses and cryptographically verifies the claims of a signed JWT token.
   *
   * @param token         the JWT token string.
   * @param isAccessToken {@code true} to use the access key, {@code false} for the refresh key.
   * @return the verified {@link Jws} of {@link Claims}.
   */
  private Jws<Claims> parseToken(String token, boolean isAccessToken) {
    return Jwts.parser()
      .verifyWith(getSigningKey(isAccessToken))
      .build()
      .parseSignedClaims(token);
  }

  /**
   * Resolves the HMAC-SHA signing key for access or refresh tokens based on configuration properties.
   *
   * @param isAccessToken {@code true} for access token key, {@code false} for refresh token key.
   * @return a {@link SecretKey} suitable for HMAC signing and verification.
   */
  private SecretKey getSigningKey(boolean isAccessToken) {
    return Keys.hmacShaKeyFor(
      isAccessToken
        ? jwtProperties.secret().getBytes(StandardCharsets.UTF_8)
        : jwtProperties.refresh().getBytes(StandardCharsets.UTF_8)
    );
  }
}

