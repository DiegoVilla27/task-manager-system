package com.diegovilla.task_manager.core.security.jwt;

/**
 * Domain representation of issued JSON Web Tokens.
 *
 * <p>Encapsulates both the short-lived access token and long-lived refresh token, along with the
 * expiration lifetime in seconds.
 *
 * @param access_token signed JWT access token for authenticating protected requests.
 * @param refresh_token signed JWT refresh token for renewing expired access tokens.
 * @param expires_in access token duration in seconds.
 * @since 1.0.0
 */
public record JwtModel(String access_token, String refresh_token, long expires_in) {}
